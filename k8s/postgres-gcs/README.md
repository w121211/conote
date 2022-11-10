# Quickstart

1. Install PGO (postgres-operator, https://github.com/CrunchyData/postgres-operator) first.

2. Place `gcs-key.json` in this directory for accessing google cloude storage:  
Google console > API credential > gcs service account > key

3. Create a cluster by

```sh
# Create a new cluster
kubectl apply -k k8s/postgres-gcs

# Modify cluster, ie re-apply the modified file
kubectl apply -k k8s/postgres-gcs

# Delete cluster
kubectl delete -k k8s/postgres-gcs
```

# pgAdmin

1. File `postgres.yaml` > uncomment `userInterface: ...`

```sh
# Apply modified postgres.yaml
kubectl apply -k k8s/postgres-gcs

# Port forward
kubectl port-forward -n ${NAMESPACE} svc/hippo-gcs-pgadmin 5050:5050
```

2. Login pgadmin  
    Username: hippo@pgo  // Username is set in `postgres.yaml`  
    Password: k8s secret > hippo-gcs-pguser-hippo > password

# Backup & recovery

Backup is stored on GCS. Please follow PGO's doc.

```sh
# Backup manually
kubectl annotate -n postgres-operator postgrescluster hippo --overwrite \
  postgres-operator.crunchydata.com/pgbackrest-backup="$(date '+%F_%H:%M:%S')"
```

# Dump & restore (one-time, simple)

Only used for initialize database.

### Dump

Run `pg_dump` in the database's container.

```sh
# Dump from local docker
docker exec -i ${pg_container_id} sh -c "PGPASSWORD=postgrespassword pg_dump -U postgresuser -d prisma -p 5432 -Fc --no-owner --no-privileges" > local_prisma_dump-$(date +%Y%m%d).dump

# Dump from k8s
kubectl exec -i conote-release-postgresql-client -- pg_dump --host conote-release-postgresql -U postgresuser -d prisma -p 5432 -Fc --no-owner --no-privileges > gke_conote_prisma_dump-$(date +%Y%m%d).dump
```

### Restore

Run `pg_restore` in the database's container.

```sh
# Restore to k8s
kubectl exec -i ${pg_pod_name} -- pg_restore --verbose -d prisma --no-owner --role hippo < ${prisma_dump_file.dump}

# Restore to local docker
# '-d postgres' means connect to database 'postgres' (otherwise will throw connection fail),
# the 'prisma' database will be created during running the restore-script
docker exec -i ${pg_container_id} sh -c "PGPASSWORD=postgrespassword pg_restore --verbose --create -d postgres -p 5432 -U postgresuser " < ${prisma_dump_file.dump}
```



# ------ Deprecated ------

## Postgresql

See:

https://gist.github.com/ricjcosme/cf576d3d4272cc35de1335a98c547da6
https://cwienczek.com/2020/06/simple-backup-of-postgres-database-in-kubernetes/
https://simplebackups.io/blog/postgresql-pgdump-and-pgrestore-guide-examples/#summary-of-the-pg_restore-command
https://github.com/rinormaloku/postgre-backup-container

### Install postgres chart

```sh
# Use helm to install postgres chart. https://bitnami.com/stack/postgresql/helm
helm repo add ...
helm repo update
helm install conote-release --set global.postgresql.auth.username=postgresuser bitnami/postgresql

PostgreSQL can be accessed via port 5432 on the following DNS names from within your cluster:

    conote-release-postgresql.default.svc.cluster.local - Read/Write connection

To get the password for "postgres" run:

    export POSTGRES_ADMIN_PASSWORD=$(kubectl get secret --namespace default conote-release-postgresql -o jsonpath="{.data.postgres-password}" | base64 -d)

To get the password for "postgresuser" run:

    export POSTGRES_PASSWORD=$(kubectl get secret --namespace default conote-release-postgresql -o jsonpath="{.data.password}" | base64 -d)

To connect to your database run the following command:

    kubectl run conote-release-postgresql-client --rm --tty -i --restart='Never' --namespace default --image docker.io/bitnami/postgresql:15.0.0-debian-11-r1 --env="PGPASSWORD=$POSTGRES_PASSWORD" \
      --command -- psql --host conote-release-postgresql -U postgresuser -d postgres -p 5432

    > NOTE: If you access the container using bash, make sure that you execute "/opt/bitnami/scripts/postgresql/entrypoint.sh /bin/bash" in order to avoid the error "psql: local user with ID 1001} does not exist"

To connect to your database from outside the cluster execute the following commands:

    kubectl port-forward --namespace default svc/conote-release-postgresql 5432:5432 &
    PGPASSWORD="$POSTGRES_PASSWORD" psql --host 127.0.0.1 -U postgresuser -d postgres -p 5432
```

```sh
# Delete chart, also needs to delete PVC
helm list
helm delete ...
kubectl get pvc
kubectl delete pvc ...


# After finish dump/restore, delete the pod
kubectl get pods -o wide
kubectl delete pod conote-release-postgresql-client
```

```sh
# psql commands
\l # List databases
\c prisma # Change to prisma database
\dt # List tables
SELECT * FROM "User";
```

### pgAdmin

```sh
kubectl run pgadmin4 --rm --tty -i --restart='Never' --image docker.io/dpage/pgadmin4 \
  --env="PGADMIN_DEFAULT_EMAIL=pgadmin@example.com" \
  --env="PGADMIN_DEFAULT_PASSWORD=admin"

kubectl port-forward svc/hippo-gcs-pgadmin 5050:5050
```

### Dump database

```sh
# Dump from local docker
docker exec -i ${pg_container_id} sh -c "PGPASSWORD=postgrespassword pg_dump -U postgresuser -d prisma -p 5432 -Fc" > local_prisma_dump-$(date +%Y%m%d).dump

# Dump from k8s
kubectl exec -i conote-release-postgresql-client -- pg_dump --host conote-release-postgresql -U postgresuser -d prisma -p 5432 -Fc --no-owner > gke_conote_prisma_dump-$(date +%Y%m%d).dump
```

#### Dump database to CSV, JSON?

Use dump & restore, then use PGAdmin to export csv, json.

[TODO] Run a pgadmin pod to access database directly?

#### Schedule dump to google cloud storage

Use Kubernetes `CronJob` to execute scheduled jobs.

Steps

1. Set up workload identity follows https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity
   This enables gke pod authorized to cloud storage api.
2. Define and deploy Kubernetes crobjob. See `./k8s/dev/job/crobjob/yaml`

```sh
DUMP_FILE=/tmp/db_prisma-$(date +%Y%m%d_%H%M%S).dump && pg_dump --host conote-release-postgresql -U postgresuser -d prisma -p 5432 -Fc > $DUMP_FILE && gcloud storage cp $DUMP_FILE gs://${GCLOUD_STORAGE_BUCKET_DB_BACKUP}/
```

#### Restore database

See https://www.postgresql.org/docs/current/app-pgrestore.html

```sh
# (Not require)
$(psql) CREATE DATABASE prisma;

# !!! Use carefully !!!, for case require to drop database,
$(psql) DROP DATABASE prisma;

# Restore to k8s
kubectl exec -i conote-release-postgresql-client -- pg_restore --host conote-release-postgresql --verbose --create -d postgres -p 5432 -U postgresuser < ${prisma_dump_file.dump}

# Restore to local docker
# '-d postgres' means connect to database 'postgres' (otherwise will throw connection fail),
# the 'prisma' database will be created during running the restore-script
docker exec -i ${pg_container_id} sh -c "PGPASSWORD=postgrespassword pg_restore --verbose --create -d postgres -p 5432 -U postgresuser " < ${prisma_dump_file.dump}
```

Troubleshoots:

- if reinstall postgres chart, also require delete pvc, otherwise will not able to login to the postgresql
  ```sh
  kubectl get pvc
  kubectl delete pvc ...
  ```
  https://github.com/bitnami/charts/issues/2061
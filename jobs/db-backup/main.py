import datetime
import gzip
import logging
import subprocess

from google.cloud import storage

# PUBSUB_TOPIC = "echo"
# PUBSUB_SUBSCRIPTION = "echo-read"
DUMP_PATH = "/tmp/"


# def upload_to_gcloud_storage(src: str):
#     s3_client = boto3.client("s3")
#     try:
#         s3_client.upload_file(
#             file_full_path, AWS_BUCKET_NAME, AWS_BUCKET_PATH + dest_file
#         )
#     except boto3.exceptions.S3UploadFailedError as exc:
#         print(exc)
#         exit(1)


def upload_blob(bucket_name: str, src_file_name: str, dest_blob_name: str):
    """Uploads a file to the cloud storage bucket."""
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(dest_blob_name)
    blob.upload_from_filename(src_file_name)
    print(f"File {src_file_name} uploaded to {dest_blob_name}.")


def compress_file(filepath: str):
    compressed_file = f"{filepath}.gz"
    with open(filepath, "rb") as f:
        with gzip.open(compressed_file, "wb") as g:
            for ln in f:
                g.write(ln)
    return compressed_file


def dump_db(dump_file_path: str) -> bytes:
    # pg_dump --host conote-release-postgresql -U postgresuser -d prisma -p 5432 -Ft > gke_conote_prisma_dump-$(date +%Y%m%d).tar
    try:
        process = subprocess.Popen(
            [
                "pg_dump",
                "--host=conote-release-postgresql",
                "-U=postgresuser",
                "-d=prisma",
                "-p=5432",
                "-Ft",
                # '--dbname=postgresql://{}:{}@{}:{}/{}'.format(user, password, host, port, database_name),
                # '-Fc',
                # '-f', dest_file,
                # '-v'
            ],
            stdout=subprocess.PIPE,
        )
        output = process.communicate()[0]

        if int(process.returncode) != 0:
            print(f"Command failed. Return code : {process.returncode}")
            exit(1)
        return output
    except Exception as inst:
        print(inst)
        exit(1)


def main():
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.DEBUG)
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    timestr = datetime.datetime.now().strftime("%Y%m%d")
    filename = f"gke_conote_prisma_dump-{timestr}.tar"
    filename_compressed = f"{filename}.gz"
    dump_file_path = f"{DUMP_PATH}{filename}"

    logger.info(f"Dump database to {filename_compressed}")
    result = dump_db(dump_file_path)
    for ln in result.splitlines():
        logger.info(ln)
    logger.info("Dump database complete")

    logger.info(f"Compressing {dump_file_path}")
    comp_file = compress_file(dump_file_path)

    print(comp_file)

    # logger.info(f"Uploading {comp_file} to Google cloud storage")
    # # upload_blob(comp_file, filename_compressed)
    # upload_blob(
    #     "conote_db-backup",
    #     comp_file,
    #     '',
    # )
    # logger.info("Uploaded to {}".format(filename_compressed))


if __name__ == "__main__":
    main()

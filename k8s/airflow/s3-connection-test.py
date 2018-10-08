"""DAG for S3 connection testing."""
from datetime import datetime
import logging

from airflow import DAG
from airflow.operators.python_operator import PythonOperator

from legion_airflow.hooks.s3_hook import S3Hook

S3_CONN_ID = 's3_conn'
TEST_FILE_NAME = 's3_check.csv'


def create_file_in_s3():
    """
    Create file in S3

    :return: None
    """
    logging.info("Create s3 hook")
    s3_hook = S3Hook(S3_CONN_ID)
    logging.info("Create file {} in s3".format(TEST_FILE_NAME))
    file_created = {'file_created': datetime.now().isoformat()}
    s3_hook.write_json_file(file_created, '', TEST_FILE_NAME)
    logging.info("Done.")


dag_test = DAG(dag_id='s3_connection_test',
               description='DAG creates file in S3',
               schedule_interval='@once',
               start_date=datetime.combine(datetime.now(), datetime.min.time()),
               catchup=True)

task = PythonOperator(
    task_id='create_file_in_s3',
    dag=dag_test,
    python_callable=create_file_in_s3)
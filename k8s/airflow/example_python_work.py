# -*- coding: utf-8 -*-
import datetime
import logging

import airflow
from airflow.operators.bash_operator import BashOperator
from airflow.operators.python_operator import PythonOperator
from airflow.models import DAG

args = {
    'owner': 'airflow',
    'start_date': datetime.datetime.utcnow() - datetime.timedelta(hours=1)
}

dag = DAG(
    dag_id='example_python_work', default_args=args,
    schedule_interval='*/1 * * * *',
    dagrun_timeout=datetime.timedelta(minutes=2))

def output_some_data():
    print('Output data')

output_data = PythonOperator(task_id='output_some_data',
                             python_callable=output_some_data,
                             dag=dag)

sleep_3_sec = BashOperator(task_id='sleep_3_seconds',
                           bash_command='sleep 3',
                           dag=dag)
sleep_2_sec = BashOperator(task_id='sleep_2_seconds',
                           bash_command='sleep 2',
                           dag=dag)

sleep_3_sec >> output_data
sleep_2_sec >> output_data

if __name__ == "__main__":
    dag.cli()
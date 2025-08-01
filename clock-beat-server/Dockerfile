FROM python:latest

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN apt update &&  apt install ffmpeg -y

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./app /app/app

CMD ["fastapi","run","app/main.py","--port","80"]
FROM python:3.11

WORKDIR /app

# deps do sistema
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    curl \
    && apt-get clean

# instala deno
RUN curl -fsSL https://deno.land/install.sh | sh

ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

# python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# código
COPY . .

# Render usa $PORT
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}"]
FROM python:3.11

WORKDIR /app

# instala dependências do sistema + node + curl
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    curl \
    && apt-get clean

# instala deno
RUN curl -fsSL https://deno.land/install.sh | sh

# adiciona deno no PATH
ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

# instala deps python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copia projeto
COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
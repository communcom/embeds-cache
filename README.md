# embeds-cache

#### Clone the repository

```bash
git clone https://github.com/communcom/embeds-cache.git
cd embeds-cache
```

#### Create .env file

```bash
cp .env.example .env
```

Add variables
```bash
GLS_IFRAMELY_CONNECT=http://iframely:8061
GLS_REDIS_HOST=embeds-redis
```

#### Create docker-compose file

```bash
cp docker-compose.example.yml docker-compose.yml 
```

#### Run

```bash
docker-compose up -d --build
```
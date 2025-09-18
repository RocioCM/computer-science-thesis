# Dockerfile para LaTeX con pygments (minted)
FROM blang/latex:ctanfull

# Instalar Python 3, pip y Pygments para soporte de minted (pygmentize)
RUN apt-get update \
	&& apt-get install -y --no-install-recommends python3 python3-pip python3-pygments \
	&& pip3 install --no-cache-dir --upgrade Pygments \
	&& rm -rf /var/lib/apt/lists/*

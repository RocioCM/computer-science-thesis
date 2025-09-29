# Dockerfile para LaTeX con pygments (minted)
FROM blang/latex:ctanfull

# Instalar Python 3, pip y una versión compatible de Pygments para soporte de minted (pygmentize)
RUN apt-get update \
	&& apt-get install -y --no-install-recommends python3 python3-pip \
	&& pip3 install --no-cache-dir "Pygments>=2.0,<2.5" \
	&& rm -rf /var/lib/apt/lists/*

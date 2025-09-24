# Nombre del archivo principal (sin extensión)
MAIN = BlockchainThesis

# Imagen Docker con LaTeX + Biber + Pygments (minted)
LATEX_IMAGE = latex-pygments:latest

# Plataforma objetivo (Apple Silicon: amd64 por compatibilidad)
DOCKER_PLATFORM ?= linux/amd64

# Comando base para correr en Docker
DOCKER_RUN = docker run --rm --platform=$(DOCKER_PLATFORM) -v $(CURDIR):/data -w /data $(LATEX_IMAGE)

# Archivos fuente
# Incluir archivos en mayúsculas y subcarpetas relevantes para detectar cambios
TEX_SRC = \
	$(wildcard *.tex) \
	$(wildcard Chapters/*.tex) \
	$(wildcard Chapters/*/*.tex) \
	$(wildcard Matter/*.tex) \
	$(wildcard Metadata/*.tex) \
	$(wildcard Configurations/*.sty) \
	UMUThesis.cls
BIB_SRC = $(wildcard *.bib) $(wildcard Bibliography/*.bib)

# Regla principal: compilar PDF
all: $(MAIN).pdf

# Alias para compilar explícitamente
pdf: $(MAIN).pdf

# Paso 1: Generar PDF (detectar cambios en .tex o .bib)
$(MAIN).pdf: $(TEX_SRC) $(BIB_SRC)
	@echo "📄 Compilando $(MAIN).tex..."
	$(DOCKER_RUN) xelatex -interaction=nonstopmode -shell-escape $(MAIN).tex || true

	@if [ "$(BIB_SRC)" != "" ] || grep -q "Citation" $(MAIN).log 2>/dev/null; then \
		echo "📚 Cambios en bibliografía detectados. Ejecutando Biber..."; \
		$(DOCKER_RUN) biber $(MAIN); \
		$(DOCKER_RUN) xelatex -interaction=nonstopmode -shell-escape $(MAIN).tex; \
	fi

	@if [ -f "$(MAIN).glo" ] || [ -f "$(MAIN).acr" ]; then \
		echo "📖 Procesando glosario y acrónimos..."; \
		$(DOCKER_RUN) makeglossaries $(MAIN); \
	fi

	@echo "🔄 Ejecutando pase final para actualizar TOC y glosarios..."
	$(DOCKER_RUN) xelatex -interaction=nonstopmode -shell-escape $(MAIN).tex

	@echo "✅ PDF generado: $(MAIN).pdf"

# Limpiar archivos temporales
clean:
	@echo "🧹 Limpiando temporales..."
	rm -f *.aux *.bbl *.bcf *.blg *.log *.out *.run.xml *.toc *.lof *.lot *.fls *.fdb_latexmk
	rm -f *.glo *.gls *.glg *.acr *.acn *.alg *.ist
	rm -rf _minted-*

# Limpiar todo, incluido el PDF
cleanall: clean
	@echo "🗑 Eliminando PDF..."
	rm -f $(MAIN).pdf

# Regla para construir la imagen Docker personalizada
build:
	docker build --platform=$(DOCKER_PLATFORM) -t $(LATEX_IMAGE) .

.PHONY: all build pdf clean cleanall

# Nombre del archivo principal (sin extensión)
MAIN = BlockchainThesis

# Imagen Docker con LaTeX + Biber
LATEX_IMAGE = blang/latex:ctanfull

# Comando base para correr en Docker
DOCKER_RUN = docker run --rm -v $(PWD):/data $(LATEX_IMAGE)

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

# Paso 1: Generar PDF (detectar cambios en .tex o .bib)
$(MAIN).pdf: $(TEX_SRC) $(BIB_SRC)
	@echo "📄 Compilando $(MAIN).tex..."
	$(DOCKER_RUN) xelatex -interaction=nonstopmode $(MAIN).tex

	@if [ "$(BIB_SRC)" != "" ] && grep -q "Citation" $(MAIN).log; then \
		echo "📚 Cambios en bibliografía detectados. Ejecutando Biber..."; \
		$(DOCKER_RUN) biber $(MAIN); \
		$(DOCKER_RUN) xelatex -interaction=nonstopmode $(MAIN).tex; \
	fi

	@echo "✅ PDF generado: $(MAIN).pdf"

# Limpiar archivos temporales
clean:
	@echo "🧹 Limpiando temporales..."
	rm -f *.aux *.bbl *.bcf *.blg *.log *.out *.run.xml *.toc *.lof *.lot *.fls *.fdb_latexmk

# Limpiar todo, incluido el PDF
cleanall: clean
	@echo "🗑 Eliminando PDF..."
	rm -f $(MAIN).pdf

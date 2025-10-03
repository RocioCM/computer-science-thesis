# Tecnología Blockchain Aplicada a la Trazabilidad en la Cadena de Suministro de Vidrio para Lograr una Economía Circular

> **Trabajo Final de Grado** - Universidad Nacional de Cuyo  
> **Autora**: Rocío Belén Corral Mena  
> **Supervisor**: Dr. Ing. Pablo Javier Vidal  
> **Año**: 2025

Este trabajo desarrolla un **prototipo de sistema de trazabilidad de envases de vidrio basado en tecnología blockchain**, diseñado para registrar y verificar cada etapa del ciclo de vida del vidrio, desde la producción hasta su reintroducción en la cadena de valor. El proyecto está enfocado en facilitar la implementación de una **economía circular** en la industria vitivinícola de Mendoza, Argentina.

## Compilación del PDF

### Opción 1: Usando Make y Docker (Recomendado)

Requiere tener `make` y `Docker` instalados. Ejecutar los siguientes comandos en la terminal:

```bash
# Construir la imagen Docker (por única vez)
make build

# Compilar usando Docker
make -B
```

### Opción 2: Comandos Manuales

Requiere tener `XeLaTeX`, `Biber`, `MakeGlossaries` y `Python3` (paquete `minted`) instalados. Ejecutar los siguientes comandos en la terminal:

```bash
xelatex -interaction=nonstopmode -shell-escape BlockchainThesis.tex
biber BlockchainThesis
makeglossaries BlockchainThesis
xelatex -interaction=nonstopmode -shell-escape BlockchainThesis.tex
```

## 🏗️ Estructura del Proyecto

```
📁 tex/
├── 📄 BlockchainThesis.tex          # Documento principal
├── 📄 UMUThesis.cls                 # Clase de documento UMU
├── 📁 Chapters/                     # Capítulos del documento
│   └── 📁 Appendices/                  # Apéndices
├── 📁 Configurations/               # Configuraciones de estilo
├── 📁 Bibliography/                 # Referencias bibliográficas
├── 📁 Metadata/                     # Metadatos del documento
├── 📁 Matter/                       # Materia preliminar
├── 📁 Figures/                      # Imágenes y diagramas
└── 📁 Fonts/                        # Fuentes personalizadas
```

Este proyecto utiliza el template de [LaTeX de Tesis de la Universidad de Murcia (UMU)](https://www.overleaf.com/latex/templates/tesis-universidad-de-murcia-umu/fdtnqcmbxndr), adaptado para cumplir con los requisitos específicos de este trabajo final de grado.

### Archivos Temporales

Para limpiar archivos temporales, ejecutar:

```bash
make clean
# O manualmente:
rm -f *.aux *.bbl *.bcf *.blg *.log *.out *.toc *.lot *.lof *.glg *.glo *.gls *.ist
```

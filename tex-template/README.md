# Compile PDF

```bash
xelatex -interaction=nonstopmode BlockchainThesis.tex
biber BlockchainThesis
xelatex -interaction=nonstopmode BlockchainThesis.tex
```

or

```bash
make -B
```

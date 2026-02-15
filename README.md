# Desarrollo de una aplicación basada en tecnología blockchain orientada a la trazabilidad y valorización del vidrio

> **Trabajo Final de Grado** - Licenciatura en Ciencias de la Computación - Universidad Nacional de Cuyo  
> **Autora**: Rocío Belén Corral Mena  
> **Supervisor**: Dr. Ing. Pablo Javier Vidal  
> **Año**: 2025

- **Documento Final del Trabajo:** [Documento-TFG-LCC-Rocio-Corral.pdf](./Documento-TFG-LCC-Rocio-Corral.pdf)
- **Slides de la presentación:** [Slides-TFG-LCC-Rocio-Corral.pdf](./Slides-TFG-LCC-Rocio-Corral.pdf)

Este repositorio reúne todo el contenido desarrollado para el **Trabajo Final de Grado** de la carrera **Licenciatura en Ciencias de la Computación** de la **Universidad Nacional de Cuyo**. Este monorepo incluye la implementación del software (blockchain, backend y frontend), la documentación de proyecto y la memoria académica en LaTeX. Cada componente es independiente e incluye su propia guía y documentación:

- Arquitectura y guía de los tres componentes: [code/README.md](./code/README.md)
- Contratos inteligentes (Solidity/Hardhat): [code/blockchain/README.md](./code/blockchain/README.md)
- API Backend (Node.js/TypeScript/Express): [code/backend-api/README.md](./code/backend-api/README.md)
- Frontend (Next.js/Typescript/Tailwind): [code/frontend/README.md](./code/frontend/README.md)
- Informe (LaTeX): [tex/README.md](./tex/README.md)

## Propósito del sistema

Implementar un sistema de trazabilidad del ciclo de vida de botellas de vidrio, desde la producción primaria hasta el reciclaje final, garantizando transparencia e inmutabilidad mediante blockchain. Los principales actores son: productores primarios, productores secundarios/embotelladores, consumidores y recicladores. A alto nivel, el sistema consta de tres componentes principales:

- **Blockchain**: registra eventos y estados en contratos inteligentes.
- **Backend API**: capa de negocio y orquestación (autenticación, validaciones, puente con blockchain).
- **Frontend**: interfaz para cada rol con visualización de trazabilidad y formularios para carga, edición y consulta de datos.

## Estructura del repositorio

```
computer-science-thesis/
├─ code/                   # Código fuente del sistema (monorepo de software)
│  ├─ blockchain/          # Contratos inteligentes (Solidity + Hardhat)
│  ├─ backend-api/         # API REST (Node.js + TypeScript + Express + MariaDB)
│  ├─ frontend/            # Web app (Next.js + Typescript + Tailwind)
├─ docs/                   # Documentación del proyecto (pruebas, flujos, evidencias)
├─ tex/                    # Memoria del trabajo (LaTeX) y PDF compilado
│  └─ BlockchainThesis.pdf # Documento final del trabajo
```

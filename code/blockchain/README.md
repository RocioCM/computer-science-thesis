# Blockchain - Sistema de Trazabilidad de Botellas

Este proyecto contiene los contratos inteligentes (smart contracts) que conforman el núcleo del sistema de trazabilidad de botellas basado en blockchain. Los contratos permiten registrar y rastrear el ciclo de vida completo de botellas, desde su producción inicial hasta su reciclaje, garantizando la inmutabilidad y transparencia de los datos.

## Visión General

El sistema utiliza contratos inteligentes desarrollados con Solidity para registrar y gestionar:

- Lotes de botellas base (producción primaria)
- Lotes de productos en botellas (producción secundaria)
- Materiales reciclados

Todos los contratos se despliegan en la red Optimistic Ethereum para aprovechar las ventajas de escalabilidad y menores costos de transacción que ofrece esta solución Layer 2 (L2), manteniendo la seguridad de Ethereum.

## Estructura del Proyecto

```
blockchain/
├── contracts/                # Contratos inteligentes en Solidity
│   ├── BaseBottlesBatchContract.sol   # Gestión de lotes de botellas base
│   ├── ProductBottlesBatchContract.sol # Gestión de productos embotellados
│   └── RecycledMaterialContract.sol   # Gestión de materiales reciclados
├── artifacts/               # Artefactos generados por la compilación (ABIs)
├── scripts/
│   └── deploy.ts            # Script principal de despliegue
├── test/                    # Pruebas para contratos
│   ├── BaseBottlesBatchContract.ts
│   ├── ProductBottlesBatchContract.ts
│   └── RecycledMaterialContract.ts
├── typechain/               # Tipos TypeScript generados para los contratos
└── utils/                   # Utilidades para el proyecto
    ├── env.ts               # Gestión de variables de entorno
    └── logger.ts            # Funcionalidades de logging en scripts
```

## Redes

Este proyecto utiliza la red Optimistic Ethereum. Puedes encontrar más información sobre ella [aquí](https://optimism.io/). La configuración de red se encuentra en el archivo [hardhat.config.ts](./hardhat.config.ts).

- **Testnet**: Optimism Sepolia (ChainID: 11155420)
- **Mainnet**: Optimism Mainnet (ChainID: 10)

Ambas redes utilizan la misma clave de API de Etherscan (variable de entorno `ETHERSCAN_API_KEY`) para la verificación de contratos. La clave privada para la cuenta de despliegue se almacena en el archivo `.env`. La cuenta debe tener fondos suficientes en la red para desplegar los contratos y pagar las tarifas de gas de las transacciones realizadas desde el backend.

Configura tu cuenta de Etherscan en [Etherscan](https://optimistic.etherscan.io/) para verificar los contratos desplegados. La verificación automática de contratos está habilitada en el archivo `hardhat.config.ts` y se ejecutará al desplegar en la red principal o de prueba.

## Configuración del Entorno

### Prerrequisitos

- Node.js 16.x o superior
- npm 8.x o superior
- Cuenta con fondos en la red Optimism (para despliegues en test o producción)

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
PRIVATE_KEY=<clave-privada-sin-0x>
ETHERSCAN_API_KEY=<tu-clave-api-de-etherscan>
```

## Desarrollo

### Instalar Dependencias

```bash
npm install
```

### Compilar Contratos

```bash
npm run compile
```

Este comando compilará los contratos Solidity y generará los artefactos necesarios en la carpeta `artifacts/`.

### Generar Tipos TypeScript

Para generar o actualizar los tipos TypeScript para los contratos (necesarios para desarrollo y pruebas con tipado estático):

```bash
npx hardhat typechain
```

### Ejecutar Pruebas

```bash
npm run test
```

Este comando ejecutará todas las pruebas unitarias ubicadas en la carpeta `test/`.

### Informe de Cobertura de Código

```bash
npm run coverage
```

Este comando ejecuta las pruebas y genera un informe detallado de cobertura de código en la carpeta `coverage/`. El coverage en este proyecto debe ser del 100% para todos los contratos.

## Despliegue de Contratos

### Desplegar en Nodo Local

Primero, inicia un nodo local de Hardhat:

```bash
npm run node
```

Luego, en otra terminal, despliega los contratos:

```bash
npm run compile
npm run deployLocal
```

### Desplegar en Red de Pruebas

```bash
npm run deployTest
```

Este comando despliega los contratos en la red Optimism Sepolia.

### Desplegar en Red Principal

```bash
npm run deployProd
```

Este comando despliega los contratos en la red Optimism Mainnet. **Usar con precaución** ya que implica costos reales de gas.

## Después del Despliegue

Después de desplegar los contratos, es necesario actualizar las direcciones y ABIs en el proyecto de API backend:

1. La dirección del contrato recién desplegado se imprime en la terminal.
2. Los archivos ABI se generan en la carpeta `artifacts/contracts/` en formato JSON.
3. Actualiza estas referencias en el [proyecto backend-api](../backend-api/) para que la aplicación utilice los nuevos contratos.

Si no se actualizan estas referencias, la aplicación (frontend y backend) seguirá utilizando los contratos antiguos.

## Integración con el Backend

Este proyecto se integra con la [API backend](../backend-api/) que proporciona endpoints REST para interactuar con los contratos inteligentes. Consulta la documentación del backend para más información sobre cómo se utilizan los contratos.

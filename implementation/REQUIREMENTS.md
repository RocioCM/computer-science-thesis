# Análisis de requerimientos

La introducción de este documento tiene como objetivo proporcionar un panorama global del proyecto, estableciendo claramente el propósito, el alcance, el valor y el público objetivo del producto. El objetivo final de este documento es definir de forma exhaustiva los requerimientos funcionales y no funcionales del sistema prototipo de trazabilidad de envases de vidrio, así como los requerimientos específicos del frontend del sistema. Estos requerimientos servirán como base para el diseño, desarrollo y validación del sistema.

#### Propósito del Producto

El propósito de este sistema es mejorar la trazabilidad en los modelos de economía circular orientados al reciclado de vidrio. Al proporcionar una plataforma que registre y audite las transacciones de residuos de vidrio a lo largo de toda la cadena de suministros, el sistema busca garantizar la transparencia y la eficiencia desde la producción del envase hasta su disposición final. Este registro confiable y verificable facilitará el cumplimiento normativo y mejorará la gestión de recursos en el sector.

#### Alcance del Producto

El alcance de este proyecto incluye el desarrollo de un contrato inteligente en la blockchain de Ethereum, una interfaz web para interactuar con dicho contrato, una base de datos SQL para almacenar información adicional, y una API que conecte todos estos componentes, junto con una API pública para facilitar la integración con otros sistemas. Además, se desarrollará un frontend prototipo específico para cada actor de la cadena de suministro de envases de vidrio (productores, comerciantes, recicladores y consumidores) que interactuará con el sistema de trazabilidad. El objetivo es centralizar y simplificar el acceso a la información de trazabilidad para todos los actores de la cadena de suministro de envases de vidrio, incluyendo productores, comerciantes, consumidores y recicladores.

#### Valor del Producto

El valor principal del sistema reside en su capacidad para garantizar la integridad y la transparencia de la información a lo largo de la cadena de suministro del vidrio reciclado. Este sistema no solo ayuda a cumplir con las normativas internacionales y locales, sino que también ofrece un beneficio competitivo a las empresas al mejorar la percepción de marca y aumentar la confianza del consumidor en productos sostenibles y responsables. Además, facilita la adopción de prácticas más sostenibles en la industria del vidrio al disponibilizar información detallada sobre la trazabilidad y el impacto ambiental de los envases.

#### Público Objetivo

El público objetivo del sistema incluye a todos los actores involucrados en la cadena de suministro de envases de vidrio, desde productores que necesitan certificar la sostenibilidad de sus productos hasta recicladores interesados en optimizar el proceso de recolección y reutilización de materiales. Además, reguladores y organismos de certificación podrán utilizar el sistema para verificar el cumplimiento de las normativas pertinentes.

#### Uso Previsto

El sistema será utilizado de diversas maneras según el rol del usuario:

- **Productores** podrán registrar y verificar la producción de envases de vidrio con materias primas vírgenes o recicladas.
- **Comerciantes** utilizarán el sistema para gestionar compras y verificar el origen del vidrio.
- **Recicladores** podrán documentar el proceso de reciclaje y su cumplimiento con las normativas.
- **Consumidores** tendrán acceso a información sobre la trazabilidad y sostenibilidad de los productos que compran y que reciclan.

Cada uno de estos roles contará con interfaces y funcionalidades específicas diseñadas para facilitar estas operaciones. El sistema se convertirá en una fuente de información confiable y verificable para todos los actores involucrados en la cadena de suministro de envases de vidrio, a partir del cual se puedan desarrollar aplicaciones y servicios adicionales.

## Requerimientos

Un requerimiento de sistema representa una necesidad específica que el sistema de software debe satisfacer para cumplir con sus objetivos. Los requerimientos son fundamentales porque definen qué debe hacer el sistema (funcionalidad) y cómo debe comportarse (calidad y restricciones). Los requerimientos se clasifican en dos categorías:

- **Requerimientos Funcionales**: Describen las funcionalidades que el sistema debe proporcionar. Estos requerimientos detallan las acciones que el sistema debe ser capaz de realizar, los procesos que debe soportar y las interacciones que debe permitir entre los usuarios y el sistema.

- **Requerimientos No Funcionales**: Establecen las características de calidad que debe cumplir el sistema, como rendimiento, seguridad, escalabilidad y usabilidad. Estos no se centran en las funcionalidades específicas, sino en cómo el sistema debe ejecutarlas.

Cada requerimiento debe ser claro, específico, medible y verificable. Un requerimiento se especifica generalmente en un formato que incluye un identificador único y una descripción detallada. A continuación, se presentan los requerimientos funcionales y no funcionales del sistema prototipo de trazabilidad de envases de vidrio, así como los requerimientos específicos del frontend del sistema.

### Requerimientos Funcionales

1. **RF-01: Registro de Transacciones en Blockchain** - El sistema debe permitir el registro de todas las transacciones de envases de vidrio a lo largo de la cadena de suministros en una blockchain públicamente accesible e inmutable.

2. **RF-02: Interfaz de Usuario para Diferentes Actores** - Desarrollar interfaces de usuario diferenciadas para los distintos actores de la cadena de suministros (productores, comerciantes, consumidores, recicladores).

3. **RF-03: Acceso a Información de Trazabilidad** - Los usuarios deben poder acceder a la información detallada de la trazabilidad de cada envase de vidrio a través de la interfaz web.

4. **RF-04: Almacenamiento de Datos Adicionales** - Almacenar información adicional que no se registre en la blockchain en una base de datos SQL, incluyendo detalles de los envases y las transacciones.

5. **RF-05: API para Interacción con la Base de Datos y Blockchain** - Desarrollar una API genérica para facilitar la interacción entre la interfaz de usuario y los datos almacenados en la blockchain y en la base de datos SQL.

6. **RF-06: API Pública para Integración** - Proveer una API pública con documentación adecuada para permitir la integración con sistemas empresariales, gubernamentales o de terceros.

### Requerimientos No Funcionales

1. **RNF-01: Transparencia** - El sistema debe garantizar la transparencia y la integridad de los datos registrados, permitiendo a los usuarios verificar la autenticidad y la procedencia de la información de trazabilidad de los envases de vidrio en todo momento.

2. **RNF-02: Mantenibilidad** - El código del sistema debe ser mantenible, con una clara documentación y estructurado de manera que permita futuras actualizaciones, nuevas integraciones y modificaciones de manera eficiente.

3. **RNF-05: Interoperabilidad** - El sistema debe ser capaz de interactuar eficientemente con diferentes tecnologías y plataformas, especialmente para la integración con otros sistemas a través de la API pública.

4. **RNF-06: Cumplimiento Normativo** - El sistema debe cumplir con todas las normativas locales e internacionales relevantes en cuanto a la gestión de datos y transacciones.

### Requerimientos Funcionales Específicos del Frontend

#### Productores

1. **RFF-01: Registro de Envases Producidos** - Permitir a los productores registrar nuevos envases producidos, incluyendo detalles como tipo de envase, cantidad, fecha de producción y características específicas de su composición.

2. **RFF-02: Visualización de Historial de Producción** - Facilitar a los productores la visualización de un historial detallado de todos los envases que han producido.

3. **RFF-03: Registro de Transacciones de Venta** - Habilitar a los productores para registrar transacciones de venta de envases de vidrio a comerciantes, especificando detalles como el comprador, cantidad vendida y precio.

#### Comerciantes

4. **RFF-04: Registro de Transacciones de Compra** - Habilitar a los comerciantes para registrar transacciones de compra de envases de vidrio, especificando detalles como el proveedor, cantidad comprada y precio.

5. **RFF-05: Gestión de Inventario** - Permitir a los comerciantes gestionar el inventario de envases de vidrio, incluyendo funcionalidades para actualizar cantidades, verificar estados y registrar movimientos de inventario.

6. **RFF-06: Visualización de Transacciones** - Permitir a los comerciantes visualizar un historial de todas las transacciones realizadas.

#### Consumidores

7. **RFF-07: Consulta de Trazabilidad de Envases** - Permitir a los consumidores consultar la trazabilidad de un envase específico, mostrando toda la cadena de suministro desde la producción hasta el reciclaje.

8. **RFF-08: Ver Información Detallada de Producto**
   - Descripción: Ofrecer a los consumidores detalles sobre los envases de vidrio, incluyendo certificaciones, origen y composición del material.

#### Recicladores

9. **RFF-09: Registro de Envases Reciclados** - Facilitar a los recicladores el registro de envases de vidrio reciclados, incluyendo información sobre la cantidad, el origen de los envases y el lote de reciclaje al que pertenecen.

10. **RFF-10: Visualización de Historial de Reciclaje** - Permitir a los recicladores acceder a un historial detallado de sus actividades de reciclaje.

11. **RFF-11: Registro de Lote de Reciclaje** - Habilitar a los recicladores para registrar lotes de reciclaje, incluyendo detalles sobre la composición, el proceso de reciclaje y la cantidad de material reciclado.

12. **RFF-12: Registro de Lote Vendido** - Permitir a los recicladores registrar lotes de material reciclado vendidos a productores o comerciantes, especificando detalles como el comprador y el precio.

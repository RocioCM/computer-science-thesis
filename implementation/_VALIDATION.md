### Documento de Estrategias de Validación para el Sistema de Trazabilidad de Envases de Vidrio

Este documento detalla las estrategias de validación que se aplicarán en el desarrollo del prototipo de este trabajo de tesis. Dado que el proyecto se desarrollará utilizando el modelo en V, se seguirá un enfoque estructurado y sistemático para las pruebas, abarcando desde pruebas de módulos individuales hasta pruebas de integración y pruebas de sistema y aceptación.

#### 1. Pruebas de Módulos Aislados (Pruebas Unitarias)

Cada módulo de la arquitectura del sistema se desarrollará y validará de forma independiente antes de integrarse con otros módulos. Estas pruebas se centrarán en la funcionalidad individual de los módulos dentro de las tres capas principales:

- **Capa de Presentación:** Se realizarán pruebas unitarias para verificar la correcta ejecución de todas las funciones de la interfaz de usuario, incluyendo interacciones con el usuario, validaciones de entrada y correcta visualización de datos.
- **Capa de Aplicación:** Las pruebas unitarias aquí validarán cada función de la API de trazabilidad, asegurando que la comunicación con la blockchain y la base de datos SQL se realice correctamente y que todas las peticiones y respuestas se gestionen según los requisitos.
- **Capa de Dominio:** En esta capa, las pruebas se enfocarán en asegurar que las transacciones realizadas en la blockchain cumplan con los protocolos de seguridad, transparencia y eficiencia requeridos, y que la sincronización con la base de datos SQL sea consistente y fiable.

Para estas pruebas, se utilizarán frameworks de prueba específicos para cada tecnología implicada, como Jest para Next.js en la capa de presentación, y Mocha para Node.js en la capa de aplicación. Las pruebas unitarias en Solidity se realizarán utilizando Hardhat que permiten simular un entorno de blockchain para pruebas.

#### 2. Pruebas de Integración

Una vez que los módulos individuales hayan sido validados, el siguiente paso será probar la integración entre ellos dentro de cada capa y entre las diferentes capas:

- **Integración Dentro de Capas:** Se verificará que los módulos dentro de cada capa interactúen correctamente entre sí, pasando datos y ejecutando operaciones de manera fluida y sin errores.
- **Integración Entre Capas:** Es crucial asegurar que la interfaz de usuario pueda comunicarse eficazmente con la API de trazabilidad y que esta, a su vez, interactúe correctamente con la blockchain y la base de datos SQL. Estas pruebas verificarán las interfaces y los contratos entre capas para garantizar que se cumplan todos los protocolos de comunicación.

Las pruebas de integración se realizarán siguiendo escenarios de uso que reflejen operaciones típicas y atípicas dentro del sistema, utilizando datos de prueba que simulen el entorno operativo real tanto como sea posible.

#### 3. Pruebas de Sistema y Aceptación

- **Pruebas de Sistema:** Se realizarán para validar el sistema completo, asegurando que todas las capas del sistema funcionen conjuntamente de acuerdo a los requisitos especificados. Esto incluye pruebas de carga y rendimiento para asegurar que el sistema pueda manejar el volumen de transacciones esperado sin degradación del servicio.
- **Pruebas de Aceptación:** Realizadas en colaboración con los usuarios finales, estas pruebas validarán que el sistema cumpla con las expectativas y necesidades del negocio, asegurando que la funcionalidad y usabilidad sean las adecuadas. Se prestará especial atención a la experiencia del usuario para garantizar una adopción fluida del sistema.

Todas las pruebas estarán documentadas detalladamente, y los resultados serán analizados para realizar ajustes y mejoras necesarias antes del lanzamiento final del sistema. La documentación de las pruebas también servirá como parte del legado del proyecto para futuras iteraciones y mantenimiento.

Este enfoque de validación garantizará que el sistema de trazabilidad no solo cumpla con los requisitos técnicos y de negocio, sino que también sea robusto, seguro y eficiente desde su lanzamiento inicial.

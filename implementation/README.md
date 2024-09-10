# Documentación previa a la implementación

## Etapa del Plan

**Actividad D**: Se definirán los proceso de desarrollo del prototipo, haciendo hincapié en seguir los fundamentos de la ingeniería de software y planificando de forma concisa y clara.

## Objetivo

El objetivo general de este plan de tesina final de carrera es el **uso de blockchain** como tecnología de vanguardia para el desarrollo de una **aplicación prototipo** destinada a **mejorar la trazabilidad** en modelos de economía circular orientados al **reciclado de vidrio**.

Como objetivos específicos que aportan al trabajo final de tesina se puede mencionar:

- Entender los procesos de adopción de tecnologías tales como blockchain y las capacidades actuales en la región para el uso de sistemas de trazabilidad.
- En todo lo referido a las Ciencias de la Computación, se busca que la alumna pueda desarrollar una aplicación prototipo funcional basada en tecnología blockchain. Esto permitirá la trazabilidad transparente, segura y en tiempo real de la gestión de residuos, en particular el vidrio, desde su generación hasta su disposición final, con el fin de garantizar el cumplimiento normativo, mejorar la eficiencia operativa y aumentar la confianza entre todos los actores involucrados en el proceso.

Resumen de los objetivos:

- [ ] Desarrollar un prototipo de aplicación basado en tecnología blockchain.
- [ ] Mejorar la trazabilidad en modelos de economía circular orientados al reciclado de vidrio.
- [ ] Garantizar el cumplimiento normativo
- [ ] Mejorar la eficiencia operativa de la cadena de suministros
- [ ] Aumentar la confianza entre los actores involucrados en el proceso

### Justificación

- ¿Por qué un prototipo? Decidimos desarrollar de un prototipo para poder demostrar la viabilidad de la solución al problema propuesto dentro del alcance esperado para un trabajo final de tesina.
- ¿Por qué tecnología blockchain? Elegimos blockchain como tecnología de vanguardia para el desarrollo de la aplicación prototipo, debido a sus características de inmutabilidad, transparencia y descentralización, que permiten garantizar la integridad y la trazabilidad de los datos en tiempo real y facilitan la colaboración entre los actores de la cadena de suministros.
- ¿Por qué reciclado de vidrio? Elegimos el reciclado de vidrio como caso de estudio para la aplicación prototipo, debido a que es un material ampliamente utilizado en la industria de alimentos y bebidas, es 100% reciclable y su reciclado en Mendoza es un proceso complejo e ineficiente que involucra a múltiples actores y etapas, lo que lo convierte en un escenario ideal para aplicar aplicar soluciones tecnológicas para mejorar la trazabilidad y la eficiencia del proceso, generando un impacto positivo en el medio ambiente y en la economía local.
- ¿Por qué trazabilidad? Decubrimos que la trazabilidad es un aspecto fundamental en la gestión de residuos, ya que permite conocer el origen, el destino, la composición y el estado de los residuos en cada etapa de la cadena de suministros, lo que facilita la toma de decisiones, la identificación de problemas y la mejora continua del proceso por parte de los actores involucrados.
- ¿Por qué economía circular? Elegimos la economía circular como enfoque para el desarrollo de la aplicación prototipo, debido a que promueve la reutilización, el reciclado y la reducción de los residuos, lo que contribuye a la sostenibilidad ambiental, social y económica de la cadena de suministros y de la sociedad en su conjunto.
- ¿Por qué cumplimiento normativo? Descubrimos que el cumplimiento normativo tanto nacional como internacional es un aspecto crítico para la adopción de sistemas de reciclaje nuevos, ya que las leyes y regulaciones ambientales establecen los requisitos legales que deben cumplir los actores de la cadena de suministros para garantizar la protección del medio ambiente y la salud de las personas, permitiendoles comercializar productos fabricados con materiales reciclables. Esto implica la necesidad de contar con sistemas de trazabilidad y control que permitan verificar el cumplimiento de las normativas vigentes.
- ¿Por qué eficiencia operativa? Descubrimos que el aumento en la eficiencia operativa es una consecuencia directa de la mejora en la trazabilidad de los residuos, ya que permite reducir los costos, los tiempos y los errores en la gestión de los residuos, lo que se traduce en una mayor productividad, competitividad y rentabilidad para los actores de la cadena de suministros.
- ¿Por qué confianza entre los actores? Descubrimos que uno de los principales motivos de fallo de iniciativas de reciclaje actuales es la falta de confianza entre los actores de la cadena de suministros, ya que la información sobre los residuos es opaca, incompleta y poco fiable, lo que dificulta la colaboración, la coordinación y la comunicación entre los actores, generando conflictos, retrasos y pérdidas en el proceso.

## Ciclo de vida del vidrio

1. Fabricación de envases de vidrio con material nuevo.
2. Venta de los envases a productores de alimentos y bebidas.
3. Comercialización y consumo de los productos envasados.
4. Generación de residuos de envases de vidrio.
5. Recolección y transporte de los residuos de envases de vidrio.
6. Clasificación y limpieza de los residuos en la planta de reciclado.
7. Molienda de los residuos de vidrio.
8. Fabricación de nuevos envases de vidrio con material reciclado.

![image](./assets/glass-lifecycle.png)

## Alcance del proyecto

El alcance de este plan de tesina final de carrera se limita a la **investigación y desarrollo de un prototipo de aplicación** basado en tecnología blockchain, destinado a mejorar la trazabilidad en modelos de economía circular orientados al reciclado de vidrio.

El sistema permitirá registrar y auditar las transacciones de los residuos de vidrio a lo largo de toda la cadena de suministros, desde su generación hasta su disposición final.

Específicamente nos enfocaremos en la cadena de producción de envases de vidrio, dejando a libre implementación futura la integración con otros actores de la cadena de reciclaje de vidrio.

![image](./assets/glass-production.png.png)

### Alcance de arquitectura de la aplicación

1. Desarrollo de un contrato inteligente (o conjunto de contratos inteligentes) en Solidity para registrar información de envases de vidrio generados y reciclados.

2. Desarrollo de una interfaz web para interactuar con el contrato inteligente desde el punto de vista de los distintos actores y visualizar la información registrada en la blockchain.

3. Desarrollo de una base de datos para almacenar información adicional de los envases de vidrio generados y reciclados y otra información relevante para la trazabilidad o uso del software.

4. Desarrollo de una API para interactuar con la base de datos y el contrato inteligente.

5. Desarrollo de una API Pública y su documentación para permitir la integración con otros sistemas empresariales, gubernamentales o de terceros.

![image](./assets/software-architecture.png)

### Entornos

- **Entorno de desarrollo**: Se utilizará un entorno de desarrollo local para el desarrollo y pruebas del prototipo, que incluirá un nodo de blockchain local, una base de datos local y una interfaz web local.

- **Presentación del prototipo**: Se realizará una presentación del prototipo en un entorno de demostración en la nube, que incluirá el uso de una red blockchain pública de pruebas, una base de datos en la nube y una interfaz web en la nube accesible desde cualquier navegador web.

### Interfaz externa

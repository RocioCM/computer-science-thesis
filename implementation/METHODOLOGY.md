# Metodología de trabajo

Con el objetivo de elegir la metodología de trabajo más adecuada para el desarrollo de software de este trabajo de tesis, se analizaron varias metodologías distintas teniendo en cuenta los siguientes aspectos:

- Objetivos del trabajo de tesis
- Planificación de actividades
- Alcance del prototipo
- Definición de requerimientos funcionales y no funcionales
- Modalidad de entrega de resultados
- Equipo de trabajo

Se analizaron diferentes metodologías de trabajo para el desarrollo de software, incluyendo metodologías de trabajo tradicionales y metodologías ágiles para determinar cuál se ajusta mejor a este proyecto. Tras la revisión general, comparamos en distintos aspectos claves 4 metodologías que consideramos más adecuadas para el desarrollo de software de este trabajo de tesis.

## Metodologías de desarrollo de software

Las metodologías de desarrollo de software pueden clasificarse en dos grandes categorías: prescriptivas y evolutivas. Los modelos prescriptivos o tradicionales, ofrecen una estructura y un orden definidos, orientados a maximizar la previsibilidad y la eficiencia en entornos bien entendidos y con pocos cambios. Estos modelos tradicionales introdujeron disciplina en la práctica de la ingeniería de software, aunque su rigidez puede ser una limitante en proyectos donde los requerimientos son inciertos o susceptibles a cambios frecuentes.

Por otro lado, los modelos de proceso evolutivo y el desarrollo ágil se adaptan mejor a las realidades dinámicas del desarrollo de software moderno. Permiten una iteración continua y la adaptación frente a los cambiantes requerimientos del negocio y la tecnología. El desarrollo ágil, en particular, pone énfasis en la flexibilidad, la colaboración continua con el cliente y la capacidad de responder a cambios con rapidez y eficacia. Los enfoques ágiles son valorados por su capacidad de facilitar la entrega rápida de software funcional y adaptarse a las necesidades cambiantes del proyecto y del mercado.

Existen montones de metodologías de desarrollo de software, cada una con sus propias ventajas y desventajas. Para elegir la metodología adecuada para este trabajo, se filtraron y preseleccionaron 5 metodologías de desarrollo de software que se consideraron más adecuadas para el desarrollo de software de este trabajo de tesis. Estas metodologías son:

- Metodología en cascada
- Metodología en V
- Metodología en espiral
- Metodología Scrum
- Metodología Kanban

### Metodología en cascada

La metodología en cascada es uno de los enfoques más antiguos y estructurados en el desarrollo de software. Este modelo es secuencial y lineal, lo cual implica que las fases del proyecto deben completarse en un orden específico sin posibilidad de retorno una vez finalizadas. Estas fases incluyen la especificación de requerimientos, planeación, modelado, implementación, despliegue y mantenimiento. Cada una de estas etapas debe ser completada satisfactoriamente antes de avanzar a la siguiente, garantizando así una planificación clara y una estructura bien definida \cite{pressman2010ingeneria}.

Este modelo es ideal para proyectos donde los requerimientos son bien conocidos y estables desde el inicio, como en las adaptaciones a sistemas existentes que requieren modificaciones específicas por cambios regulatorios. Sin embargo, este modelo ha sido criticado por su rigidez y por la dificultad que presenta ante la necesidad de adaptarse a cambios durante el desarrollo del software. Problemas como la dificultad de los clientes para expresar todos los requerimientos inicialmente y los riesgos de descubrir errores tardíamente en el proceso son inherentes al modelo en cascada. Estos desafíos pueden llevar a lo que se conoce como "estados de bloqueo", donde la dependencia entre tareas secuenciales causa inactividad y retrasos significativos.

### Metodología en V

El modelo en V es una variante del modelo de cascada que añade un enfoque sistemático en la verificación y validación de cada etapa del desarrollo del software \cite{pressman2010ingeneria}. Este modelo sigue un enfoque secuencial, de forma similar al modelo en cascada, sin embargo, se diferencia en que cada fase de desarrollo está emparejada con una fase de prueba correspondiente, formando una estructura en forma de "V". A medida que el proyecto avanza hacia abajo en la primera mitad de la V, los requisitos y componentes del sistema son detallados cada vez más. Una vez completada la codificación, el proceso asciende por el lado derecho de la V, donde cada etapa de desarrollo anterior es validada a través de pruebas detalladas.

Esta metodología es útil para asegurar que cada componente del software sea validado en paralelo a su creación, permitiendo la detección y corrección temprana de errores. Este enfoque ayuda a minimizar los riesgos al final del proyecto, haciendo del modelo en V una opción fuerte para proyectos que requieren altos estándares de calidad y donde los errores tempranos podrían tener consecuencias costosas o críticas. Aunque este modelo comparte algunas limitaciones con el modelo en cascada, como la dificultad para adaptarse a cambios significativos una vez que el proyecto está en curso, su estructura permite una mejor gestión del riesgo y calidad mediante la validación constante de cada etapa del desarrollo.

![image](./assets/model-v.png) Figura n. 1: Modelo en V. Fuente: \cite{pressman2010ingeneria}

### Metodología en espiral

El modelo espiral es un enfoque evolutivo que combina la iteración de los prototipos con la rigurosidad sistemática del modelo en cascada \cite{pressman2010ingeneria}. Este modelo se distingue por su enfoque cíclico que permite el crecimiento incremental de la definición de un sistema mientras se reduce su grado de riesgo. Se caracteriza por su flexibilidad en el manejo de los riesgos y la capacidad de adaptarse continuamente a las necesidades cambiantes del proyecto a través de iteraciones sucesivas.

En el modelo espiral, el desarrollo se organiza en una serie de espirales o ciclos, cada uno de los cuales representa una fase del proyecto. Cada ciclo incluye la planificación, la identificación de riesgos, el desarrollo y la evaluación del prototipo o secciones del software, y la planificación de la siguiente iteración. Los prototipos iniciales suelen ser simples y evolucionan para convertirse en versiones cada vez más completas y complejas del software, a medida que se profundiza en el ciclo espiral.

Una característica clave del modelo espiral es su enfoque en la gestión de riesgos en cada ciclo. En cada paso del proceso, se realiza una evaluación de riesgos, lo que permite identificar y mitigar problemas potenciales antes de que se conviertan en obstáculos significativos. Este enfoque iterativo permite a los desarrolladores y clientes entender mejor y reaccionar a los riesgos en cada nivel de evolución del proyecto. Esta capacidad para adaptarse y evolucionar con el tiempo lo hace particularmente útil en entornos dinámicos y en constante cambio.

El desafío de este modelo radica en que requiere una evaluación continua y experta de los riesgos, y puede ser difícil convencer a los clientes, especialmente en situaciones contractuales, de que el enfoque iterativo y evolutivo es controlable y efectivo. Además, la complejidad en la gestión del proyecto puede aumentar debido a la necesidad de revisiones y ajustes continuos en cada ciclo.

### Metodología Scrum

Scrum es una metodología ágil de desarrollo de software que se alinea con los principios del Manifiesto Ágil, promoviendo flexibilidad, colaboración continua, y adaptabilidad a los cambios. Este modelo estructura el desarrollo en ciclos cortos y repetitivos llamados sprints, típicamente de 2 semanas, donde no se permiten cambios durante el sprint, proporcionando estabilidad mientras se abordan los requisitos seleccionados del backlog, una lista dinámica y priorizada de tareas del proyecto que puede modificarse en cualquier momento \cite{pressman2010ingeneria}.

El proceso de Scrum incluye reuniones diarias breves donde cada miembro del equipo responde a tres preguntas fundamentales sobre sus avances, obstáculos, y planes, lo que ayuda a identificar y resolver problemas rápidamente, fomentando la autoorganización y eficiencia del equipo. Al final de cada sprint, se realiza una demostración al cliente del incremento de software desarrollado, facilitando la retroalimentación vital que influirá en los siguientes sprints y asegurando que el producto final cumpla con las expectativas del cliente.

Scrum es efectivo en entornos donde la incertidumbre es la norma, aceptando el caos como una parte inherente del desarrollo de software y ofreciendo herramientas para gestionarlo de manera efectiva. La iteración continua, evaluación constante de riesgos, y la involucración directa del cliente permiten dirigir proyectos hacia resultados exitosos, incluso en circunstancias desafiantes, haciendo de Scrum una metodología ideal para proyectos que exigen flexibilidad y colaboración estrecha con el cliente.

### Metodología Kanban

El método Kanban es un enfoque visual para la gestión del flujo de trabajo. Este método busca optimizar la eficiencia al evitar la sobrecarga de trabajo, eliminando cuellos de botella y desperdicios, y reduciendo los tiempos de espera, lo que a su vez incrementa el rendimiento de los procesos \cite{alaidaros2021kanban}.

Kanban se centra en la utilización de un sistema de "pull" (extracción), donde el trabajo solo se inicia cuando hay capacidad disponible, lo que permite una mayor adaptabilidad y respuesta a los cambios en las prioridades del proyecto. Este enfoque se visualiza mediante el tablero Kanban, dividido en columnas que representan diferentes etapas del proceso de desarrollo. Cada tarea o 'tarjeta' se mueve de izquierda a derecha a través del tablero, reflejando su progreso desde el inicio hasta la finalización. Las columnas básicas de un tablero Kanban incluyen "Por hacer", "En progreso" y "Completado", aunque el tablero puede personalizarse agregando columnas adicionales según las necesidades del proyecto.

Este método define cinco principios claves para la práctica: limitar el trabajo en progreso, visualizar el flujo de trabajo, medir y gestionar el flujo, hacer explícitas las políticas del proceso, y utilizar modelos para reconocer oportunidades de mejora. Estos principios ayudan a mantener el enfoque en la eficiencia del flujo de trabajo y en la mejora continua, permitiendo al equipo adaptar sus prácticas y procesos según las necesidades del proyecto y las condiciones del entorno.

Kanban no requiere cambios estructurales grandes para su implementación y se adapta a la situación actual de cualquier organización. Una posible desventaja es que Kanban requiere una disciplina rigurosa y una comunicación constante dentro del equipo para mantener la precisión del flujo visualizado en el tablero y que se corresponda con la realidad, lo que puede ser desafiante en equipos grandes. Además, la falta de fases definidas y la ausencia de revisiones sistemáticas del progreso pueden dificultar la gestión de proyectos a gran escala, donde se requiere una coordinación extensa entre múltiples equipos o disciplinas. A su vez, Kanban puede no ser adecuado para proyectos que enfrentan cambios frecuentes y radicales en los requerimientos, ya que está diseñado para optimizar flujos de trabajo existentes más que para adaptarse a innovaciones constantes.

### Comparación de metodologías de desarrollo de software

A continuación, se presenta una comparación de las metodologías de desarrollo de software analizadas en distintos aspectos clave para determinar cuál es la más adecuada para el desarrollo de software de este trabajo de tesis.

| **Aspecto/Metodología** | **Ágil (Scrum)** | **Ágil (Kanban)** | **Cascada** | **Modelo en V** | **Espiral** |
| --- | --- | --- | --- | --- | --- |
| **Naturaleza del Proyecto** | Ideal para proyectos con requisitos cambiantes y evolución constante. | Proyectos que requieren flujo continuo y flexibilidad para gestionar tareas cambiantes. | Adecuado para proyectos con requisitos claros y definidos desde el principio. | Proyectos de alta criticidad, con un enfoque riguroso en calidad y validación. | Proyectos grandes y complejos, con alto riesgo y múltiples iteraciones. |
| **Requisitos del Cliente** | Requisitos pueden cambiar en cada sprint, permite la interacción continua con el cliente. | Requisitos pueden ajustarse de manera continua según la demanda y prioridades. | Requisitos fijos desde el inicio, cualquier cambio implica un costo significativo. | Requisitos claros desde el inicio, con verificación constante. | Requisitos pueden refinarse en cada iteración, ideal para proyectos con incertidumbre. |
| **Tamaño del Equipo** | Equipos pequeños (idealmente 5-9 personas) colaborativos y multidisciplinarios. | Equipos pequeños a medianos, más flexibles en tamaño, ajustando tareas según flujo de trabajo. | Equipos medianos a grandes, con roles bien definidos y fases claras. | Equipos medianos a grandes, con roles especializados para cada fase. | Equipos medianos a grandes, flexibles en roles según los ciclos de iteración y gestión de riesgos. |
| **Cultura Organizacional** | Cultura colaborativa, centrada en la mejora continua y la autoorganización. | Cultura flexible y adaptable, con enfoque en la optimización del flujo de trabajo. | Cultura jerárquica y estructurada, con fases bien definidas. | Cultura disciplinada y centrada en la calidad, con un fuerte enfoque en la validación y verificación. | Cultura orientada a la gestión del riesgo y adaptación a cambios continuos en cada iteración. |
| **Flexibilidad en Gestión** | Alta flexibilidad para adaptarse a los cambios durante cada sprint (iteración). | Alta flexibilidad en la gestión del flujo, ajustando la carga de trabajo en función de las prioridades. | Baja flexibilidad, difícil de cambiar una vez iniciado el proyecto. | Flexibilidad moderada, cambios difíciles una vez avanzado el proyecto. | Alta flexibilidad, con ciclos iterativos que permiten gestionar cambios de forma continua. |
| **Documentación** | Documentación mínima, suficiente para facilitar la entrega de valor funcional. | Documentación mínima, enfocada en la visualización del flujo y el progreso. | Documentación detallada en cada fase del ciclo de vida del desarrollo. | Documentación extensa, especialmente en fases de pruebas y validación. | Documentación formal en cada iteración para gestionar riesgos y validar avances. |
| **Riesgos y Control de Calidad** | Los riesgos se manejan en cada sprint, se realizan pruebas y ajustes continuos. | Control continuo del flujo de trabajo, evitando cuellos de botella. Riesgo gestionado al ajustar el WIP (Work In Progress). | Riesgo alto si los requisitos cambian, control de calidad al final del ciclo. | Riesgo bajo, con verificación y validación constante en cada fase. | Riesgo bajo, diseñado específicamente para gestionar riesgos en cada iteración. |
| **Entregas al Cliente** | Entregas frecuentes (cada sprint), con incrementos de software funcional. | Entregas continuas, en función de la finalización de tareas o según demanda. | Una única entrega al final del proyecto. | Una única entrega al final, con validación en cada fase. | Entregas iterativas, con revisiones parciales hasta completar el proyecto. |
| **Curva de Aprendizaje** | Media. Requiere adaptación a la metodología y roles dentro del equipo (Scrum Master, Product Owner). | Baja. Fácil de implementar, basado en la mejora continua del flujo de trabajo. | Baja. Fácil de comprender, pero difícil de ajustar a cambios durante el ciclo. | Media. Se requiere disciplina en verificación y validación. | Alta. Complejidad en la gestión del riesgo y las iteraciones continuas. |
| **Velocidad de Desarrollo** | Alta. Las iteraciones cortas permiten entregas rápidas y ajustes según retroalimentación. | Alta. Flujo continuo de desarrollo, ajustando la velocidad según las prioridades. | Baja a media. El ciclo es largo debido a la rigidez en las fases. | Media. Las fases de validación pueden ralentizar el desarrollo. | Media. El proceso iterativo es más largo por la gestión de riesgos y planificación. |
| **Manejo de Cambios** | Cambios fáciles de gestionar en cada sprint, se ajusta según las prioridades del cliente. | Los cambios se gestionan en función de la demanda, ajustando tareas en el flujo de trabajo. | Cambios difíciles y costosos de implementar una vez que el proyecto ha avanzado. | Los cambios son complicados, requieren revalidación constante. | Cambios gestionados de manera continua en cada ciclo, permitiendo ajustes según los riesgos. |
| **Manejo de Riesgos** | Riesgos gestionados en cada sprint, con retrospectivas que permiten mejoras continuas. | Riesgos manejados de manera continua, ajustando el flujo y reduciendo cuellos de botella. | Riesgo alto, ya que los problemas suelen descubrirse al final, durante la fase de prueba. | Riesgo bajo, debido a la verificación y validación constantes en cada fase. | Riesgo bajo, diseñado para gestionar riesgos en cada iteración de manera efectiva. |

### Descarte de Metodologías

En la selección de metodologías para este proyecto, en primer lugar, se descartó Scrum por varias razones específicas. Scrum, aunque es potente en proyectos que requieren flexibilidad y adaptación continua, fue eliminado principalmente porque necesita una presencia activa y constante del cliente o un Product Owner para guiar los sprints, lo cual no es posible en este proyecto. Además, la estructura de equipo pequeño y la falta de roles específicos como Scrum Master y Product Owner complican la implementación de Scrum, que además implica reuniones regulares intensivas que no se alinean con la capacidad del equipo, ya que cobran mayor sentido en proyectos con equipos más grandes con mayor diversidad de roles y responsabilidades con necesidad de sincronización frecuente.

Por otro lado, la metodología en espiral, que se centra en la gestión de riesgos y adaptación a cambios continuos, fue considerada innecesariamente compleja para este proyecto dado que los riesgos y la incertidumbre son relativamente bajos y no justifican el tiempo adicional y la complejidad que esta metodología implicaría.

### Elección de Metodologías

En base al análisis realizado, elegimos el modelo en V y Kanban como las metodologías más adecuadas, para el desarrollo de este proyecto de tesis, debido a sus características y beneficios particulares que se alinean con los requisitos y condiciones del proyecto. El modelo en V se seleccionó sobre el modelo en cascada aunque ambos son aplicables a equipos de cualquier tamaño y proyectos de cualquier envergadura. Estos modelos se centran en la planificación y la documentación, lo cual es apropiado para este proyecto dado que los requerimientos están claramente definidos y la probabilidad de cambios y de riesgo es baja, gracias a una investigación y análisis exhaustivos realizados previamente.

El modelo en V ofrece la ventaja de validar y verificar cada módulo de software funcional antes de avanzar a la siguiente fase, permitiendo correcciones tempranas en caso de errores o cambios, lo que aumenta la flexibilidad y adaptabilidad del proyecto. Este enfoque de validación continua en cada fase contrasta con el modelo en cascada, que, aunque estructurado, avanza secuencialmente sin permitir el retroceso, lo que puede complicar la corrección de errores detectados en fases tardías. Por lo tanto, el modelo en V es preferido por su capacidad para manejar mejor el riesgo y por ofrecer una estructura que facilita la adaptación y mejora continua del proyecto.

Adicionalmente, se decidió integrar Kanban para la gestión de tareas y el seguimiento del flujo de trabajo durante el desarrollo. Kanban complementará al modelo en V al proporcionar una mayor flexibilidad en la gestión de micro-tareas y prioridades diarias, sin sobrecargar al pequeño equipo de trabajo. Esta metodología es ligera y fácil de implementar, y su naturaleza visual ayuda a mantener una vista clara del avance del proyecto, facilitando el seguimiento y la intervención rápida por parte del tutor y el estudiante.

La combinación de estas dos metodologías permitirá al equipo de trabajo mantener un equilibrio entre la rigurosidad y la flexibilidad, garantizando la calidad y la validación en cada fase del proyecto, mientras se mantiene la adaptabilidad y la eficiencia en la gestión de tareas diarias.

### Implementación Conjunta de Metodologías

La implementación conjunta del modelo en V y Kanban será llevada a cabo utilizando un enfoque integrado que capitaliza las fortalezas de ambas metodologías. El modelo en V guiará la estructura general del proceso de desarrollo, asegurando que cada etapa del proyecto, desde la planificación hasta la validación, se ejecute con un enfoque en la calidad y la documentación rigurosa. Paralelamente, Kanban se aplicará dentro de cada etapa del modelo en V para gestionar y visualizar las tareas diarias. Esto permitirá controlar el progreso y hacer ajustes operativos sin comprometer la estructura metodológica del modelo en V. El uso de un tablero Kanban facilitará la visualización del estado de las tareas en tiempo real, promoviendo una gestión ágil que se ajusta a la dinámica del equipo y los requerimientos del proyecto.

La combinación de estas metodologías asegura un balance entre la rigurosidad y la flexibilidad dentro del proceso de desarrollo, permitiendo que el equipo mantenga una planificación clara y una gestión eficiente de tareas, al mismo tiempo que se enfoca en una entrega final de alta calidad y bien documentado.

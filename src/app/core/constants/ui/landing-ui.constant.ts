import { APP_ROUTE_URLS } from '../route-urls.constant';

/** Tarjeta de beneficio (icono Material + textos + acento visual no textual). */
export type LandingBenefitCard = {
  readonly icon: string;
  readonly title: string;
  readonly body: string;
  readonly accent: 'indigo' | 'teal' | 'slate';
};

/** Paso numerado de «¿Cómo funciona?». */
export type LandingHowStep = {
  readonly icon: string;
  readonly title: string;
  readonly body: string;
};

/** Bloque de categorías de datos recogidos en la aplicación. */
export type LandingDataCategory = {
  readonly title: string;
  readonly bullets: readonly string[];
};

/** Pregunta frecuente. */
export type LandingFaqItem = {
  readonly question: string;
  readonly answer: string;
};

/** Fila de la tabla comparativa sin cuenta / con cuenta. */
export type LandingFlowCompareRow = {
  readonly aspect: string;
  readonly anonymous: string;
  readonly authenticated: string;
};

/** Contenido estructurado de la página pública de bienvenida. */
export const LANDING_PAGE_UI = {
  routes: {
    anonymousPrediction: APP_ROUTE_URLS.predictionsAnonymous,
    login: APP_ROUTE_URLS.authLogin,
    register: APP_ROUTE_URLS.authRegister
  },

  hero: {
    eyebrow: 'Herramienta de apoyo a la prevención',
    title: 'Estimación orientativa de riesgo cardiovascular',
    subtitle:
      'Guía tus respuestas en un cuestionario estructurado y obtén una probabilidad estimada, un nivel de riesgo y orientaciones basadas en el modelo disponible.',
    supporting:
      'Puedes usar la predicción sin registrarte o crear una cuenta para guardar historial, informes en PDF y explorar escenarios alternativos.',
    chipsAriaLabel: 'Características principales',
    chips: ['Cuestionario guiado', 'Resultados interpretables', 'Opción con o sin cuenta'] as const,
    panelTitle: 'Empezar ahora',
    panelHint: 'La vía sin cuenta te permite ver el flujo completo con un solo clic.',
    panelBadge: 'Recomendado para empezar',
    primaryCta: 'Comenzar sin cuenta',
    secondaryLogin: 'Ya tengo cuenta',
    secondaryRegister: 'Crear cuenta'
  },

  howItWorks: {
    sectionTitle: '¿Cómo funciona?',
    sectionHint: 'Cuatro pasos claros, desde la entrada hasta el resultado.',
    steps: [
      {
        icon: 'route',
        title: 'Elige tu modo',
        body: 'Entra sin cuenta para una primera estimación, o inicia sesión si quieres vincular los cálculos a tu perfil guardado.'
      },
      {
        icon: 'assignment',
        title: 'Completa el cuestionario',
        body: 'Sin cuenta indicas perfil, condiciones médicas y peso; el bloque adicional de hábitos y salud es opcional. Con cuenta solo añades peso y, si quieres, ese mismo bloque opcional.'
      },
      {
        icon: 'monitor_heart',
        title: 'Obtén la estimación',
        body: 'La aplicación calcula una probabilidad y un nivel de riesgo a partir de los datos que has introducido, con el modelo configurado en el servicio.'
      },
      {
        icon: 'insights',
        title: 'Revisa el detalle',
        body: 'Ves el resumen, factores que más influyen en el resultado y recomendaciones textuales. Con cuenta puedes consultar historial, descargar PDF y probar cambios con «qué pasaría si».'
      }
    ] as const satisfies readonly LandingHowStep[]
  },

  dataScope: {
    sectionTitle: '¿Qué información se utiliza?',
    sectionHint:
      'La estimación se basa únicamente en los datos que recoge la propia aplicación en sus formularios. Lo siguiente coincide con los campos implementados en el flujo de predicción.',
    intro:
      'No se introducen en esta interfaz medidas de laboratorio ni variables clínicas que no estén contempladas en el cuestionario (por ejemplo, tensión arterial, colesterol o glucemia no forman parte de los campos del formulario).',
    categories: [
      {
        title: 'Datos personales y medidas básicas',
        bullets: [
          'Sexo biológico y fecha de nacimiento (para situarte en el contexto del modelo).',
          'Altura y peso en el momento de la predicción (para el cálculo asociado al modelo).'
        ] as const
      },
      {
        title: 'Historia bucal y diabetes',
        bullets: [
          'Dientes extraídos según las opciones del cuestionario.',
          'Categoría de diabetes según las opciones fijas del formulario (incluye embarazo cuando aplica).'
        ] as const
      },
      {
        title: 'Condiciones médicas y limitaciones funcionales',
        bullets: [
          'Antecedentes autorreferidos: angina, ictus, asma, EPOC, cáncer de piel, trastorno depresivo, enfermedad renal y artritis.',
          'Limitaciones en audición, visión, concentración, movilidad, actividades básicas o salidas, según las casillas del formulario.'
        ] as const
      },
      {
        title: 'Cuestionario opcional de hábitos y salud',
        bullets: [
          'Estado de salud general, días con mala salud física o mental, último chequeo médico y actividad física.',
          'Horas de sueño, tabaquismo, uso de cigarrillo electrónico y consumo de alcohol.',
          'TAC o radiografía de tórax, prueba de VIH, vacunas (gripe, neumococo, tétanos/Tdap), riesgo alto el último año y resultado COVID conocido.'
        ] as const
      }
    ] as const satisfies readonly LandingDataCategory[]
  },

  intro: {
    sectionTitle: 'Qué hace esta herramienta',
    paragraph1:
      'Organiza la información que tú mismo aportas en formularios validados y la envía al motor de predicción configurado para tu entorno. El resultado incluye probabilidad, nivel de riesgo y, cuando el servicio lo proporciona, factores explicativos y recomendaciones.',
    paragraph2:
      'Está pensada para apoyar la comprensión del riesgo estimado en contextos formativos o de investigación aplicada a la salud, siempre con lectura crítica y sin sustituir el juicio clínico.',
    calloutTitle: 'Uso responsable',
    calloutBody:
      'La salida del modelo es orientativa: depende de la veracidad y exhaustividad de tus respuestas y no constituye diagnóstico ni prescripción.'
  },

  benefits: {
    sectionTitle: 'Qué aporta la experiencia',
    items: [
      {
        icon: 'fact_check',
        accent: 'indigo',
        title: 'Formularios alineados con el flujo real',
        body: 'Mismas secciones y validaciones que verás al calcular una predicción, para que la landing describa fielmente lo que encontrarás después.'
      },
      {
        icon: 'description',
        accent: 'teal',
        title: 'Resultados estructurados',
        body: 'Probabilidad, nivel de riesgo, marca temporal cuando existe, factores destacados y texto de recomendación cuando el servicio los devuelve.'
      },
      {
        icon: 'folder_shared',
        accent: 'slate',
        title: 'Continuidad con cuenta',
        body: 'Historial de predicciones, detalle, exportación a PDF y simulación de cambios puntuales sobre predicciones ya guardadas.'
      }
    ] as const satisfies readonly LandingBenefitCard[]
  },

  flows: {
    sectionTitle: 'Sin cuenta frente a cuenta registrada',
    sectionHint: 'La misma estimación subyacente; cambia qué datos rellenas cada vez y qué funciones quedan disponibles después.',
    vsLabel: 'o',
    anonymousBadge: 'Acceso inmediato',
    anonymousTitle: 'Predicción sin cuenta',
    anonymousLead: 'Ideal para una primera consulta o para mostrar el sistema sin dar de alta usuarios.',
    anonymousDetail:
      'Introduces en cada visita el perfil, las condiciones médicas y el peso; puedes completar también el cuestionario opcional. En este dispositivo puede guardarse un identificador anónimo para el flujo sin sesión.',
    authenticatedBadge: 'Perfil guardado',
    authenticatedTitle: 'Predicción con cuenta',
    authenticatedLead: 'Tu perfil y tus condiciones médicas se reutilizan desde tu cuenta en cada nueva predicción.',
    authenticatedDetail:
      'Solo indicas el peso actual y, si lo deseas, el cuestionario opcional. Además tienes historial, informe PDF y simulación «qué pasaría si» en el detalle.'
  },

  flowCompare: {
    caption: 'Comparación entre predicción sin cuenta y con cuenta',
    columnAspect: 'Aspecto',
    columnAnonymous: 'Sin cuenta',
    columnAuthenticated: 'Con cuenta',
    rows: [
      {
        aspect: 'Datos en cada predicción',
        anonymous: 'Perfil completo, condiciones médicas y peso en cada envío.',
        authenticated: 'Peso y, si quieres, cuestionario opcional; el resto viene de tu perfil guardado.'
      },
      {
        aspect: 'Historial y listado',
        anonymous: 'No se guarda historial en tu cuenta.',
        authenticated: 'Listado de predicciones anteriores asociadas a tu usuario.'
      },
      {
        aspect: 'Detalle e informe PDF',
        anonymous: 'No disponible como historial persistente en cuenta.',
        authenticated: 'Detalle por predicción y descarga de informe en PDF cuando el servicio lo permite.'
      },
      {
        aspect: 'Simulación «qué pasaría si»',
        anonymous: 'No incluida en este flujo.',
        authenticated: 'Disponible en la vista de detalle de una predicción guardada.'
      }
    ] as const satisfies readonly LandingFlowCompareRow[]
  },

  faq: {
    sectionTitle: 'Preguntas frecuentes',
    sectionHint: 'Respuestas breves sobre el uso y los límites de la herramienta.',
    items: [
      {
        question: '¿Sustituye esto a una consulta médica?',
        answer:
          'No. Es una herramienta orientativa basada en modelo y en datos que introduces tú. Ante síntomas, dudas o decisiones sobre tu salud, acude a un profesional sanitario cualificado.'
      },
      {
        question: '¿El cuestionario largo de hábitos es obligatorio?',
        answer:
          'No. Ese bloque es opcional tanto en la predicción sin cuenta como en la predicción con cuenta; la estimación puede hacerse con los datos obligatorios del formulario principal.'
      },
      {
        question: '¿Qué implica usar la predicción sin cuenta?',
        answer:
          'Rellenas los datos en cada ocasión. Para el funcionamiento del flujo sin sesión puede utilizarse un identificador anónimo almacenado en tu navegador, según lo implementado en la aplicación.'
      },
      {
        question: '¿Qué gano al registrarme?',
        answer:
          'Puedes guardar predicciones en tu historial, revisar el detalle de cada una, exportar informe en PDF cuando esté disponible y explorar escenarios alternativos con la simulación «qué pasaría si».'
      },
      {
        question: '¿El porcentaje de riesgo es una certeza?',
        answer:
          'Es una estimación del modelo con los datos aportados. Su utilidad es formativa y de apoyo a la reflexión; la incertidumbre clínica real no se agota en un único número.'
      }
    ] as const satisfies readonly LandingFaqItem[]
  },

  clinicalContext: {
    sectionTitle: 'Contexto sobre el riesgo cardiovascular',
    lead:
      'En la práctica clínica el riesgo cardiovascular se valora con mucha información adicional (exploración física, analíticas, antecedentes detallados, tratamientos, etc.). Esta aplicación solo dispone de lo que tú indicas en sus formularios: sirve como complemento formativo, no como sustituto de esa valoración.',
    bullets: [
      'Las estimaciones dependen de la calidad y sinceridad de las respuestas.',
      'Los umbrales y el comportamiento del modelo corresponden a la versión desplegada del servicio de predicción.',
      'Los textos de recomendación son generados o proporcionados por el sistema según la configuración actual; no sustituyen el consejo personalizado de un profesional.'
    ] as const
  },

  medicalDisclaimer: {
    sectionTitle: 'Aviso médico',
    paragraphs: [
      'Esta aplicación ofrece una estimación orientativa de riesgo cardiovascular a partir de cuestionarios autorreferidos. No constituye diagnóstico médico, prueba complementaria ni tratamiento.',
      'No utilices el resultado para automedicarte ni para posponer una valoración presencial que necesites. Consulta siempre a personal sanitario cualificado ante síntomas, cambios en tu estado de salud o decisiones terapéuticas.'
    ] as const
  },

  closing: {
    line: 'Información actualizada según la versión de formularios y rutas implementadas en esta aplicación.'
  },

  cta: {
    sectionTitle: 'Siguiente paso',
    hint: 'Elige la opción que mejor encaje con tu situación: probar en segundos o preparar un perfil para seguimiento.',
    emphasisLine: 'La predicción sin cuenta sigue siendo la forma más directa de ver el resultado con los datos que ya conoces de memoria.',
    anonymousButton: 'Comenzar sin cuenta',
    loginButton: 'Iniciar sesión',
    registerButton: 'Crear cuenta',
    anonymousNote: 'Sin registro',
    loginNote: 'Acceso con correo',
    registerNote: 'Alta nueva'
  }
} as const;

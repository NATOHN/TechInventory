
// 1. Creamos el objeto que contendrá todas las traducciones
export const translations = {

    // 2. Traducciones correspondientes al idioma español.
    es: {
        profile: 'Mi Perfil',
        technicianRole: 'Técnico de mantenimiento',
        darkMode: 'Modo oscuro',
        logout: 'Cerrar sesión',
        languageLabel: 'Idioma',

        // Traducciones del módulo de Perfil y Configuración.
        administratorRole: 'Administrador',
        technicianShortRole: 'Técnico',

        profileSettings: 'Configuración',
        profileLogoutErrorTitle: 'Error',
        profileLogoutErrorMessage: 'No fue posible cerrar la sesión.',

        configurationTitle: 'Configuración',
        configurationAdministrationSection: 'Administración',
        configurationUsersTitle: 'Usuarios y técnicos',
        configurationUsersDescription: 'Gestiona los usuarios del sistema',
        configurationLocationsTitle: 'Sucursales y departamentos',
        configurationLocationsDescription: 'Administra ubicaciones',
        configurationEmployeesTitle: 'Empleados',
        configurationEmployeesDescription: 'Registra y consulta empleados',

        configurationApplicationSection: 'Aplicación',
        configurationThemeTitle: 'Tema',
        configurationThemeDescription: 'Claro / Oscuro',

        configurationAccountSection: 'Cuenta',
        configurationChangePasswordTitle: 'Cambiar contraseña',
        configurationChangePasswordDescription: 'Actualiza la contraseña de tu cuenta',

        // 4. Traducciones utilizadas en la pantalla de inicio de sesión.
        loginSubtitle: 'Inicia sesión para continuar',
        emailPlaceholder: 'Correo electrónico',
        passwordPlaceholder: 'Contraseña',
        loginButton: 'Ingresar',

        // 6. Traducciones utilizadas en la pantalla de inicio.
        homeTitle: 'Bienvenido a TechInventory',
        homeDescription: 'Control de inventario, ubicación y mantenimiento de equipos',

        // Textos adicionales utilizados por el Dashboard de Inicio.
        homeGreeting: 'Hola',
        homeUserFallback: 'usuario',
        homeGreetingMessage: 'Que tengas un excelente día',
        homeUpdatingIndicators: 'Actualizando indicadores...',
        homeIndicatorsError: 'No se pudieron actualizar los indicadores.',
        homeEquipmentStat: 'Equipos',
        homeAvailableStat: 'Disponibles',
        homeInUseStat: 'En uso',
        homeMaintenanceStat: 'Mantenimientos',
        homeRecentActivity: 'Actividad reciente',
        homeLatestFive: 'Últimos 5',
        homeNoActivity: 'No hay actividad registrada todavía.',
        homeActivityEquipmentRegistered: 'Nuevo equipo registrado',
        homeActivityMaintenanceCompleted: 'Mantenimiento completado',
        homeActivityMaintenanceStarted: 'Mantenimiento iniciado',
        homeNotificationsTitle: 'Notificaciones',
        homeNoNotifications: 'No hay notificaciones todavía.',
        homeNotificationMaintenanceStarted: 'Se inició mantenimiento del equipo',
        homeNotificationMaintenanceCompleted: 'Se finalizó el mantenimiento del equipo',

        // 8. Traducciones utilizadas en la lista de equipos.
        equipmentListTitle: 'Equipos registrados',
        registerEquipmentButton: 'Registrar equipo',

        // 10. Traducciones utilizadas dentro de las tarjetas de equipos.
        seriesLabel: 'Serie',
        assignedLabel: 'Asignado',
        unassigned: 'Sin asignar',

        // 12. Traducciones utilizadas en la pantalla
        // de detalle de cada equipo.
        backButton: 'Regresar',
        equipmentDetailTitle: 'Detalle del equipo',
        codeLabel: 'Código',
        branchLabel: 'Sucursal',
        departmentLabel: 'Departamento',
        qrCodeTitle: 'Código QR',
        qrComingSoon: 'Disponible en una fase posterior',

        // 14. Traducciones utilizadas en la pantalla
        // de registro de equipos.
        registerEquipmentTitle: 'Registrar equipo',
        brandPlaceholder: 'Marca',
        modelPlaceholder: 'Modelo',
        serialPlaceholder: 'Serie',
        branchPlaceholder: 'Sucursal',
        departmentPlaceholder: 'Departamento',
        assignedEmployeePlaceholder: 'Empleado asignado',
        selectPhotoButton: 'Seleccionar fotografía',
        saveEquipmentButton: 'Guardar equipo',

        // 15. Traducciones utilizadas en las alertas
        // de validación del formulario.
        incompleteFieldsTitle: 'Campos incompletos',
        incompleteFieldsMessage:
            'Complete todos los campos obligatorios y seleccione una fotografía.',
        validDataTitle: 'Datos válidos',
        validDataMessage:
            'La información del equipo fue validada correctamente.',

        // 16. Traducciones utilizadas en las pestañas
        // principales de navegación.
        homeTab: 'Inicio',
        equipmentTab: 'Equipos',
        profileTab: 'Perfil',


        // 18. Traducciones utilizadas en los mensajes
        // de validación del componente CustomInput.
        invalidEmail: 'Correo inválido',
        shortPassword: 'Contraseña muy corta',
        invalidPhone: 'Número de teléfono inválido',
        requiredField: 'Este campo es obligatorio',

        // 19. Traducciones utilizadas para mostrar
        // los estados de los equipos.
        statusActive: 'Disponible',
        statusWorkshop: 'Mantenimiento',
        statusInactive: 'Baja',
        statusInUse: 'En uso',

        // 20. Cantidad de resultados mostrados en el inventario.
        resultsLabel: "Resultados",

        // 21. Título de la sección con los datos generales del equipo.
        equipmentInformationTitle: "Información del equipo",

        // 22. Textos utilizados en el buscador y filtros avanzados.
        equipmentSearchPlaceholder: "Buscar equipos...",
        advancedFiltersTitle: "Filtros avanzados",
        advancedFiltersDescription: "Filtra los equipos por sucursal, departamento o marca.",
        branchFilterTitle: "Sucursal",
        departmentFilterTitle: "Departamento",
        brandFilterTitle: "Marca",
        allFeminine: "Todas",
        allMasculine: "Todos",
        clearFiltersButton: "Limpiar filtros",

        //23. Textos utilizados en las acciones disponibles desde el detalle del equipo.
        quickActionsTitle: "Acciones rápidas",
        maintenanceAction: "Mantenimiento",
        historyAction: "Historial",
        changeLocationAction: "Reasignar equipo",
        qrAction: "Código QR",

        //24. Textos utilizados al cambiar la ubicación de un equipo.
        currentLocationLabel: "Ubicación actual",
        newBranchLabel: "Nueva sucursal",

        //25. Texto utilizado para seleccionar el nuevo departamento.
        newDepartmentLabel: "Nuevo departamento",

        //26.Textos utilizados al guardar una nueva ubicación.
        saveLocationButton: "Guardar ubicación",
        selectDepartmentMessage: "Seleccione un departamento antes de guardar.",
        locationUpdatedTitle: "Ubicación actualizada",
        locationUpdatedMessage: "La ubicación del equipo se actualizó correctamente.",

        //27. Textos relacionados con el código QR y su impresión
        qrCode: "Código QR",
        printQr: "Imprimir / Reimprimir QR",
        qrPreview: "Vista previa de etiqueta",
        qrPreviewDescription: "Esta etiqueta podrá imprimirse nuevamente cuando el código QR físico necesite ser reemplazado.",
        cancel: "Cancelar",
        print: "Imprimir",
        printLabelTitle: "Imprimir etiqueta",
        printLabelMessage: "Se preparará la etiqueta QR del equipo",
        printLabelMessageEnd: "para impresión.",

        //28. Textos de la pantalla de historial de equipos
        equipmentHistoryTitle: "Historial del equipo",
        registeredMovements: "Movimientos registrados:",
        previousLocation: "Ubicación anterior",
        newLocation: "Nueva ubicación",
        noMovementsTitle: "Sin movimientos registrados",
        noMovementsMessage: "Los cambios de ubicación realizados a este equipo aparecerán aquí.",

        //29. Textos utilizados para dar de baja un equipo.
        decommissionButton: "Dar de baja equipo",
        decommissionTitle: "Dar de baja equipo",
        decommissionMessageStart: "¿Está seguro de que desea dar de baja el equipo",
        decommissionMessageEnd: "? El equipo permanecerá registrado y conservará su historial.",
        decommissionConfirm: "Dar de baja",
        decommissionSuccessTitle: "Equipo dado de baja",
        decommissionSuccessMessageStart: "El equipo",
        decommissionSuccessMessageEnd: "fue dado de baja correctamente.",

        //30. Textos utilizados para capturar fotografías del equipo.
        takePhotoButton: "Tomar fotografía",
        cameraPermissionTitle: "Permiso requerido",
        cameraPermissionMessage: "Debe permitir el acceso a la cámara para tomar una fotografía.",

        // 31. Mensaje mostrado cuando se intenta guardar una reasignación sin modificaciones.
        noChangesTitle: "Sin cambios",
        noChangesMessage: "No se realizó ningún cambio.",

        //32. Textos utilizados para reactivar un equipo dado de baja.
        reactivateButton: "Reactivar equipo",
        reactivateTitle: "Reactivar equipo",
        reactivateMessageStart: "¿Está seguro de que desea reactivar el equipo",
        reactivateMessageEnd: "? Se restaurará el estado que tenía antes de ser dado de baja.",
        reactivateConfirm: "Reactivar",
        reactivateSuccessTitle: "Equipo reactivado",
        reactivateSuccessMessageStart: "El equipo",
        reactivateSuccessMessageEnd: "fue reactivado correctamente.",

        //33. Textos utilizados para editar la información propia de un equipo.
        editEquipmentTitle: "Editar equipo",
        saveChangesButton: "Guardar cambios",
        editEquipmentSuccessTitle: "Equipo actualizado",
        editEquipmentSuccessMessage: "La información del equipo se actualizó correctamente.",


        //34. Validación para evitar números de serie repetidos.
        duplicateSerialTitle: "Serie duplicada",
        duplicateSerialMessage: "Ya existe un equipo registrado con este número de serie.",

        // 35. Filtros utilizados en el historial del equipo.
        maintenanceHistoryFilter: "Mantenimientos",
        locationsHistoryFilter: "Ubicaciones",

        //36. Tipos de eventos mostrados dentro del historial.
        locationChangeEvent: "Cambio de ubicación",
        responsibleChangeEvent: "Cambio de responsable",

        // 37. Textos compactos utilizados en la línea de tiempo.
        historyFromLabel: "De",
        historyToLabel: "A",

        //38. Estados vacíos de los filtros del historial.
        noMaintenanceHistoryTitle: "Sin mantenimientos registrados",
        noMaintenanceHistoryMessage: "Los mantenimientos realizados a este equipo aparecerán aquí.",

        noStatusHistoryTitle: "Sin cambios de estado registrados",
        noStatusHistoryMessage: "Las bajas y reactivaciones realizadas a este equipo aparecerán aquí.",

        //39. Textos utilizados para mostrar cambios de estado en el historial del equipo.
        equipmentDeactivatedEvent: "Equipo dado de baja",
        equipmentReactivatedEvent: "Equipo reactivado",
        statusChangeLabel: "Estado",

        //40. Datos adicionales mostrados en los eventos del historial del equipo.
        performedByLabel: "Realizado por",
        reasonLabel: "Motivo",

        //Textos utilizados en el modulo de mantenimiento.
        maintenanceTab: "Mantenimiento",
        maintenanceTitle: "Mantenimiento",
        maintenanceAll: "Todos",
        maintenanceInProgress: "En proceso",
        maintenanceCompleted: "Finalizado",
        maintenanceTechnicianLabel: "Técnico",
        maintenanceTypePreventive: "Preventivo",
        maintenanceTypeCorrective: "Correctivo",
        maintenancePriorityLabel: "Prioridad",
        maintenancePriorityLow: "Baja",
        maintenancePriorityMedium: "Media",
        maintenancePriorityHigh: "Alta",
        newMaintenanceButton: "Nuevo mantenimiento",
        newMaintenanceTitle: "Nuevo mantenimiento",
        maintenanceDescriptionPlaceholder: "Descripción del trabajo",
        maintenancePartsTitle: "Repuestos utilizados",
        maintenancePartNamePlaceholder: "Nombre del repuesto",
        maintenancePartQuantityPlaceholder: "Cantidad",
        addPartButton: "Agregar repuesto",
        saveMaintenanceButton: "Guardar mantenimiento",
        finalizeMaintenanceButton: "Finalizar mantenimiento",
        noMaintenancesTitle: "Sin mantenimientos",
        noMaintenancesMessage: "No hay mantenimientos registrados en esta categoria.",

        // Textos adicionales del formulario y detalle de mantenimiento.
        maintenanceChecklistTitle: "Lista de verificación",
        maintenanceChecklistInternalCleaning: "Limpieza interna",
        maintenanceChecklistHardwareReview: "Revisión de hardware",
        maintenanceChecklistSoftwareUpdate: "Actualización de software",
        maintenanceChecklistFunctionTests: "Pruebas de funcionamiento",
        maintenanceChecklistGeneralObservations: "Observaciones generales",

        maintenanceFinalStatusLabel: "Estado final",
        maintenanceStatusOperational: "Operativo",
        maintenanceStatusFollowUp: "Requiere seguimiento",
        maintenanceStatusOutOfService: "Fuera de servicio",

        maintenanceDecommissionReasonLabel: "Motivo de baja",
        maintenanceDecommissionReasonPlaceholder: "Ej. Daño irreversible en tarjeta madre",

        maintenanceStartProcessButton: "Iniciar proceso",
        maintenanceSaveChangesButton: "Guardar cambios",
        maintenanceGeneratePdfButton: "Generar constancia PDF",

        maintenanceInvalidQuantityTitle: "Cantidad inválida",
        maintenanceInvalidQuantityMessage: "La cantidad del repuesto debe ser un número entero mayor que cero.",
        maintenanceFinalStatusRequiredTitle: "Estado final requerido",
        maintenanceFinalStatusRequiredMessage: "Selecciona el estado final del equipo antes de finalizar el mantenimiento.",

        maintenanceSignatureLabel: "Firma de conformidad",
        maintenanceSignedOnLabel: "Firmado el",

        // Textos de la constancia y firma del mantenimiento.
        maintenanceCertificateTitle: "Constancia de mantenimiento",
        maintenanceCertificateInstructions:
            "El empleado asignado al equipo debe firmar para confirmar la recepción y conformidad del mantenimiento realizado.",

        maintenanceInfoTitle: "Información del mantenimiento",
        maintenanceEquipmentLabel: "Equipo",
        maintenanceBrandModelLabel: "Marca / modelo",
        maintenanceTypeLabel: "Tipo",
        maintenanceResultLabel: "Resultado",
        maintenanceNotSpecified: "No especificado",

        maintenanceWorkPerformedLabel: "Trabajo realizado",
        maintenanceCompletedTasksLabel: "Tareas realizadas",
        maintenanceNoTasks: "Sin tareas registradas.",
        maintenancePartsUsedLabel: "Repuestos utilizados",
        maintenanceQuantityLabel: "Cantidad",
        maintenanceNoParts: "No se utilizaron repuestos.",

        maintenanceSignatureRequiredFrom: "Firma requerida de",
        maintenanceClearSignatureButton: "Limpiar",
        maintenanceConfirmSignatureButton: "Confirmar firma",
        maintenanceSavingSignatureButton: "Guardando...",

        maintenanceSignatureRequiredTitle: "Firma requerida",
        maintenanceSignatureRequiredMessage: "Debes firmar antes de continuar.",
        maintenanceSignatureCaptureError: "No se pudo capturar la firma. Intenta de nuevo.",
        maintenanceSignatureSaveError: "Ocurrió un problema al guardar la firma.",

        maintenanceUnassignedEmployee: "Sin asignar",
        maintenanceDefaultDecommissionReason:
            "Daño definitivo detectado durante mantenimiento",

        // Textos del escáner QR e ingreso manual para iniciar mantenimiento.
        maintenanceScannerTitle: "Escanear equipo",
        maintenanceScannerInstruction: "Centra el código QR dentro del recuadro",

        maintenanceEnterCodeLabel: "Ingresa el código del equipo (EQ-xxxxx)",
        maintenanceContinueButton: "Continuar",
        maintenanceBackToScannerButton: "Volver a escanear",
        maintenanceEnterCodeManuallyButton: "Ingresar código manualmente",

        maintenanceCameraPermissionMessage:
            "Necesitamos acceso a tu cámara para escanear el código QR del equipo.",
        maintenanceAllowCameraButton: "Permitir cámara",

        maintenanceEquipmentNotFoundTitle: "Equipo no encontrado",
        maintenanceEquipmentNotFoundMessage: "Verifica que el código sea correcto.",

        maintenanceInactiveEquipmentTitle: "Equipo dado de baja",
        maintenanceInactiveEquipmentMessage:
            "El equipo __CODIGO__ está dado de baja y no puede recibir mantenimiento.",

        maintenanceAlreadyInProgressTitle: "Mantenimiento en proceso",
        maintenanceAlreadyInProgressMessage:
            "El equipo __CODIGO__ ya tiene un mantenimiento en proceso. Debes finalizarlo antes de iniciar otro.",

        maintenanceCancelButton: "Cancelar",
        maintenanceOpenExistingButton: "Abrir mantenimiento",

        // Mensajes específicos cuando una pestaña de Mantenimiento está vacía.
        noMaintenancesAllTitle: "Sin mantenimientos registrados",
        noMaintenancesAllMessage: "Todavía no hay mantenimientos registrados.",

        noMaintenancesInProgressTitle: "Sin mantenimientos en proceso",
        noMaintenancesInProgressMessage: "No hay mantenimientos pendientes de finalizar.",

        noMaintenancesCompletedTitle: "Sin mantenimientos finalizados",
        noMaintenancesCompletedMessage: "Todavía no hay mantenimientos completados.",

        // Filtro por rango de fechas en Mantenimiento.
        maintenanceDateFilterButton: "Filtrar por fecha",
        maintenanceDateFrom: "Desde",
        maintenanceDateTo: "Hasta",
        maintenanceDateSelect: "Seleccionar fecha",


        // Acciones mostradas después de firmar y finalizar el mantenimiento.
        maintenanceFinishedTitle: "Mantenimiento finalizado",
        maintenancePdfReadyMessage:
            "La constancia PDF fue generada correctamente. Puedes compartirla ahora o cerrar para volver a Mantenimiento.",
        maintenanceShareCertificateButton: "Compartir constancia",
        maintenanceCloseButton: "Cerrar",

        // Error al generar automáticamente la constancia después de finalizar.
        maintenancePdfGenerationErrorTitle: "No se pudo generar la constancia",
        maintenancePdfGenerationErrorMessage:
            "El mantenimiento se finalizó correctamente, pero no se pudo generar el PDF. Puedes generarlo después desde el detalle del mantenimiento.",


        // Traducciones utilizadas en la pantalla de Reportes.
        reportsTab: 'Reportes',
        reportsTitle: 'Reportes',
        reportsUpdating: 'Actualizando reporte...',
        reportsLoadError: 'No fue posible cargar los datos del reporte.',

        reportsPeriodTitle: 'Período del reporte',
        reportsPeriodCurrentMonth: 'Este mes',
        reportsPeriodLast30Days: 'Últimos 30 días',
        reportsPeriodCurrentYear: 'Este año',
        reportsPeriodAllHistory: 'Todo el historial',

        reportsRegisteredEquipment: 'Equipos registrados',
        reportsInUse: 'En uso',
        reportsAvailable: 'Disponibles',
        reportsMaintenance: 'Mantenimiento',
        reportsDecommissioned: 'Dados de baja',

        reportsEquipmentByStatus: 'Equipos por estado',
        reportsMaintenanceByType: 'Mantenimientos por tipo',
        reportsEquipmentByBranch: 'Equipos por sucursal',

        reportsPreventive: 'Preventivo',
        reportsCorrective: 'Correctivo',
        reportsInactive: 'Baja',

        reportsNoEquipment: 'Sin equipos registrados en este período.',
        reportsNoMaintenance: 'Sin mantenimientos registrados en este período.',

        reportsExportExcel: 'Exportar a Excel',
        reportsExportingExcel: 'Generando Excel...',
        reportsNoExportDataTitle: 'Sin información',
        reportsNoExportDataMessage: 'No existen datos para exportar en el período seleccionado.',
        reportsExportErrorTitle: 'Error',
        reportsExportErrorMessage: 'No fue posible generar el archivo Excel.',

        reportsUnidentified: 'No identificado',
        reportsUnassigned: 'Sin asignar',

        // ==================== PERFIL - PANTALLAS SECUNDARIAS ====================

        // Editar perfil
        editProfileTitle: 'Mi Perfil',
        editProfilePhotoHint: 'Toca la foto para cambiarla',
        editProfileRoleLabel: 'Rol',
        editProfileMemberSince: 'Miembro desde',
        editProfileFullNameLabel: 'Nombre completo',
        editProfileNamePlaceholder: 'Tu nombre',
        editProfileEmailLabel: 'Correo electrónico',
        editProfileSaving: 'Guardando cambios...',
        editProfileSaveButton: 'Guardar cambios',

        editProfilePermissionTitle: 'Permiso requerido',
        editProfilePermissionMessage: 'Necesitamos acceso a tu galería para elegir una foto.',
        editProfileImageErrorTitle: 'Imagen no disponible',
        editProfileImageErrorMessage: 'No fue posible preparar esta imagen para guardarla.',
        editProfileRequiredTitle: 'Campo requerido',
        editProfileRequiredMessage: 'Ingresa tu nombre completo.',
        editProfileUpdatedTitle: 'Perfil actualizado',
        editProfileUpdatedMessage: 'Tus cambios se guardaron correctamente.',
        editProfileErrorTitle: 'No se pudo actualizar el perfil',
        editProfileErrorMessage: 'No fue posible actualizar tu perfil.',

        // Cambiar contraseña
        changePasswordTitle: 'Cambiar contraseña',
        changePasswordSubtitle: 'Actualiza la contraseña de tu cuenta',
        changePasswordSecurityMessage: 'Por seguridad debes confirmar tu contraseña actual antes de establecer una nueva.',
        changePasswordCurrentLabel: 'Contraseña actual',
        changePasswordCurrentPlaceholder: 'Ingresa tu contraseña actual',
        changePasswordNewLabel: 'Nueva contraseña',
        changePasswordNewPlaceholder: 'Mínimo 8 caracteres',
        changePasswordConfirmLabel: 'Confirmar nueva contraseña',
        changePasswordConfirmPlaceholder: 'Repite la nueva contraseña',
        changePasswordUpdating: 'Actualizando contraseña...',
        changePasswordButton: 'Cambiar contraseña',

        changePasswordRequiredTitle: 'Campos requeridos',
        changePasswordRequiredMessage: 'Completa la contraseña actual, la nueva contraseña y su confirmación.',
        changePasswordShortTitle: 'Contraseña muy corta',
        changePasswordShortMessage: 'La nueva contraseña debe contener al menos 8 caracteres.',
        changePasswordMismatchTitle: 'Las contraseñas no coinciden',
        changePasswordMismatchMessage: 'La confirmación debe ser igual a la nueva contraseña.',
        changePasswordSameTitle: 'Contraseña sin cambios',
        changePasswordSameMessage: 'La nueva contraseña debe ser diferente de la contraseña actual.',
        changePasswordSessionTitle: 'Sesión no disponible',
        changePasswordSessionMessage: 'No fue posible verificar tu sesión actual.',
        changePasswordIncorrectTitle: 'Contraseña incorrecta',
        changePasswordIncorrectMessage: 'La contraseña actual que ingresaste no es correcta.',
        changePasswordErrorTitle: 'No se pudo cambiar la contraseña',
        changePasswordErrorMessage: 'No fue posible cambiar la contraseña en este momento.',
        changePasswordSuccessTitle: 'Contraseña actualizada',
        changePasswordSuccessMessage: 'Tu contraseña fue cambiada correctamente.',
        commonAccept: 'Aceptar',

        // Usuarios
        usersTitle: 'Usuarios y técnicos',
        usersAll: 'Todos',
        usersTechnicians: 'Técnicos',
        usersAdmins: 'Admins',
        usersEmailLabel: 'Correo',
        usersRoleLabel: 'Rol',
        usersTechnicianRole: 'Técnico',
        usersAdministratorRole: 'Administrador',
        usersTechnicianBadge: 'TÉCNICO',
        usersAdminBadge: 'ADMIN',
        usersRegisterButton: 'Registrar usuario',

        // Registrar usuario
        newUserTitle: 'Registrar usuario',
        newUserEmployeeLabel: 'Empleado',
        newUserSelectEmployee: 'Seleccionar empleado',
        newUserEmailLabel: 'Correo electrónico',
        newUserTemporaryPasswordLabel: 'Contraseña temporal',
        newUserPasswordPlaceholder: 'Mínimo 8 caracteres',
        newUserConfirmPasswordLabel: 'Confirmar contraseña',
        newUserRepeatPasswordPlaceholder: 'Repetir contraseña',
        newUserTypeLabel: 'Tipo de usuario',
        newUserTechnician: 'Técnico',
        newUserAdministrator: 'Administrador',
        newUserCreating: 'Creando cuenta...',
        newUserCreateButton: 'Crear usuario',
        newUserSelectEmployeeTitle: 'Seleccionar empleado',
        newUserNoEmployees: 'No hay empleados disponibles para crear una cuenta.',

        newUserEmployeeRequiredTitle: 'Empleado requerido',
        newUserEmployeeRequiredMessage: 'Selecciona el empleado al que pertenecerá esta cuenta.',
        newUserInvalidEmailTitle: 'Correo inválido',
        newUserInvalidEmailMessage: 'Ingresa un correo electrónico válido.',
        newUserExistingEmailTitle: 'Correo existente',
        newUserExistingEmailMessage: 'Ya existe una cuenta registrada con ese correo.',
        newUserInvalidPasswordTitle: 'Contraseña inválida',
        newUserInvalidPasswordMessage: 'La contraseña temporal debe contener al menos 8 caracteres.',
        newUserMismatchTitle: 'Contraseñas diferentes',
        newUserMismatchMessage: 'La contraseña y su confirmación deben coincidir.',
        newUserCreatedTitle: 'Usuario creado',
        newUserCreatedPrefix: 'La cuenta de',
        newUserCreatedSuffix: 'fue creada correctamente.',
        newUserErrorTitle: 'No se pudo crear el usuario',
        newUserErrorMessage: 'No fue posible crear la cuenta.',

        // Sucursales y departamentos
        locationsTitle: 'Sucursales',
        locationsSubtitle: 'Administración de ubicaciones',

        locationsRestrictedTitle: 'Acceso restringido',
        locationsBranchRestrictedMessage: 'Solo un administrador puede registrar nuevas sucursales.',
        locationsDepartmentRestrictedMessage: 'Solo un administrador puede registrar departamentos.',

        locationsNameRequiredTitle: 'Nombre requerido',
        locationsBranchNameMessage: 'Ingresa un nombre válido para la sucursal.',
        locationsBranchExistingTitle: 'Sucursal existente',
        locationsBranchExistingMessage: 'Ya existe una sucursal registrada con ese nombre.',
        locationsBranchCreatedTitle: 'Sucursal creada',
        locationsRegisteredSuffix: 'fue registrada correctamente.',
        locationsBranchErrorTitle: 'No se pudo crear la sucursal',
        locationsBranchErrorMessage: 'No fue posible registrar la sucursal.',

        locationsNewBranchTitle: 'Nueva sucursal',
        locationsNewBranchDescription: 'Registra una nueva ubicación de la empresa.',
        locationsBranchNameLabel: 'Nombre de la sucursal',
        locationsBranchPlaceholder: 'Ej. Sucursal San Pedro Sula',
        locationsRegisteringBranch: 'Registrando sucursal...',
        locationsCreateBranchButton: 'Crear sucursal',
        locationsRegisteredBranches: 'Sucursales registradas',
        locationsBranchSingular: 'sucursal',
        locationsBranchPlural: 'sucursales',
        locationsNoBranches: 'No hay sucursales registradas.',

        locationsDepartmentRequiredTitle: 'Sucursal requerida',
        locationsDepartmentRequiredMessage: 'Selecciona la sucursal a la que pertenece el departamento.',
        locationsDepartmentNameMessage: 'Ingresa un nombre válido para el departamento o zona.',
        locationsDepartmentExistingTitle: 'Departamento existente',
        locationsDepartmentExistingMessage: 'Esta sucursal ya tiene un departamento o zona con ese nombre.',
        locationsDepartmentCreatedTitle: 'Departamento creado',
        locationsDepartmentErrorTitle: 'No se pudo crear el departamento',
        locationsDepartmentErrorMessage: 'No fue posible registrar el departamento.',

        locationsNewDepartmentTitle: 'Nuevo departamento o zona',
        locationsNewDepartmentDescription: 'Selecciona primero la sucursal a la que pertenece.',
        locationsBranchLabel: 'Sucursal',
        locationsSelectBranch: 'Seleccionar sucursal',
        locationsDepartmentLabel: 'Departamento o zona',
        locationsDepartmentPlaceholder: 'Ej. Contabilidad',
        locationsRegisteringDepartment: 'Registrando departamento...',
        locationsCreateDepartmentButton: 'Crear departamento',
        locationsRegisteredDepartments: 'Departamentos y zonas registradas',
        locationsDepartmentSingular: 'departamento',
        locationsDepartmentPlural: 'departamentos',
        locationsNoDepartments: 'No hay departamentos registrados.',
        locationsBranchUnavailable: 'Sucursal no disponible',
        locationsSelectBranchTitle: 'Seleccionar sucursal',
        locationsRegisterBranchFirst: 'Primero debes registrar una sucursal.',

        // Empleados
        employeesAccessTitle: 'Acceso restringido',
        employeesAccessMessage: 'Esta sección está disponible únicamente para administradores.',
        employeesBackButton: 'Regresar',
        employeesTitle: 'Empleados',
        employeesSubtitle: 'Administración de empleados',
        employeesRegisterTitle: 'Registrar empleado',
        employeesRegisterDescription: 'Asigna el empleado a una sucursal y departamento.',
        employeesFullNameLabel: 'Nombre completo',
        employeesNamePlaceholder: 'Ej. Juan Pérez',
        employeesBranchLabel: 'Sucursal',
        employeesSelectBranch: 'Seleccionar sucursal',
        employeesDepartmentLabel: 'Departamento o zona',
        employeesSelectDepartment: 'Seleccionar departamento',
        employeesRegistering: 'Registrando empleado...',
        employeesRegisterButton: 'Registrar empleado',
        employeesRegisteredTitle: 'Empleados registrados',
        employeesSingular: 'empleado',
        employeesPlural: 'empleados',
        employeesDepartmentUnavailable: 'Departamento no disponible',
        employeesBranchUnavailable: 'Sucursal no disponible',
        employeesEmpty: 'No hay empleados registrados.',
        employeesSelectBranchTitle: 'Seleccionar sucursal',
        employeesSelectDepartmentTitle: 'Seleccionar departamento',
        employeesNoDepartments: 'Esta sucursal todavía no tiene departamentos registrados.',

        employeesRestrictedMessage: 'Solo un administrador puede registrar empleados.',
        employeesNameRequiredTitle: 'Nombre requerido',
        employeesNameRequiredMessage: 'Ingresa el nombre completo del empleado.',
        employeesBranchRequiredTitle: 'Sucursal requerida',
        employeesBranchRequiredMessage: 'Selecciona la sucursal donde trabaja el empleado.',
        employeesDepartmentRequiredTitle: 'Departamento requerido',
        employeesDepartmentRequiredMessage: 'Selecciona el departamento o zona del empleado.',
        employeesCreatedTitle: 'Empleado creado',
        employeesCreatedSuffix: 'fue registrado correctamente.',
        employeesErrorTitle: 'No se pudo crear el empleado',
        employeesErrorMessage: 'No fue posible registrar el empleado.',
        employeesSelectBranchFirstTitle: 'Selecciona una sucursal',
        employeesSelectBranchFirstMessage: 'Primero debes seleccionar la sucursal del empleado.',

    },


    // 3. Traducciones correspondientes al idioma inglés.
    en: {
        profile: 'My Profile',
        technicianRole: 'Maintenance Technician',
        darkMode: 'Dark mode',
        logout: 'Log out',
        languageLabel: 'Language',

        // Translations for the Profile and Settings module.
        administratorRole: 'Administrator',
        technicianShortRole: 'Technician',

        profileSettings: 'Settings',
        profileLogoutErrorTitle: 'Error',
        profileLogoutErrorMessage: 'The session could not be closed.',

        configurationTitle: 'Settings',
        configurationAdministrationSection: 'Administration',
        configurationUsersTitle: 'Users and technicians',
        configurationUsersDescription: 'Manage system users',
        configurationLocationsTitle: 'Branches and departments',
        configurationLocationsDescription: 'Manage locations',
        configurationEmployeesTitle: 'Employees',
        configurationEmployeesDescription: 'Register and view employees',

        configurationApplicationSection: 'Application',
        configurationThemeTitle: 'Theme',
        configurationThemeDescription: 'Light / Dark',

        configurationAccountSection: 'Account',
        configurationChangePasswordTitle: 'Change password',
        configurationChangePasswordDescription: 'Update your account password',

        // 5. Traducciones utilizadas en la pantalla de inicio de sesión.
        loginSubtitle: 'Sign in to continue',
        emailPlaceholder: 'Email address',
        passwordPlaceholder: 'Password',
        loginButton: 'Sign in',

        // 7. Traducciones utilizadas en la pantalla de inicio.
        homeTitle: 'Welcome to TechInventory',
        homeDescription: 'Equipment inventory, location and maintenance control',

        // Additional texts used by the Home dashboard.
        homeGreeting: 'Hello',
        homeUserFallback: 'user',
        homeGreetingMessage: 'Have a great day',
        homeUpdatingIndicators: 'Updating indicators...',
        homeIndicatorsError: 'The indicators could not be updated.',
        homeEquipmentStat: 'Equipment',
        homeAvailableStat: 'Available',
        homeInUseStat: 'In use',
        homeMaintenanceStat: 'Maintenance',
        homeRecentActivity: 'Recent activity',
        homeLatestFive: 'Latest 5',
        homeNoActivity: 'No activity has been recorded yet.',
        homeActivityEquipmentRegistered: 'New equipment registered',
        homeActivityMaintenanceCompleted: 'Maintenance completed',
        homeActivityMaintenanceStarted: 'Maintenance started',
        homeNotificationsTitle: 'Notifications',
        homeNoNotifications: 'No notifications yet.',
        homeNotificationMaintenanceStarted: 'Maintenance started for equipment',
        homeNotificationMaintenanceCompleted: 'Maintenance completed for equipment',

        // 9. Traducciones utilizadas en la lista de equipos.
        equipmentListTitle: 'Registered equipment',
        registerEquipmentButton: 'Register equipment',

        // 11. Traducciones utilizadas dentro de las tarjetas de equipos.
        seriesLabel: 'Serial',
        assignedLabel: 'Assigned to',
        unassigned: 'Unassigned',

        // 13. Traducciones utilizadas en la pantalla
        // de detalle de cada equipo.
        backButton: 'Back',
        equipmentDetailTitle: 'Equipment details',
        codeLabel: 'Code',
        branchLabel: 'Branch',
        departmentLabel: 'Department',
        qrCodeTitle: 'QR Code',
        qrComingSoon: 'Available in a later phase',

        // 14. Translations used on the equipment
        // registration screen.
        registerEquipmentTitle: 'Register equipment',
        brandPlaceholder: 'Brand',
        modelPlaceholder: 'Model',
        serialPlaceholder: 'Serial number',
        branchPlaceholder: 'Branch',
        departmentPlaceholder: 'Department',
        assignedEmployeePlaceholder: 'Assigned employee',
        selectPhotoButton: 'Select photo',
        saveEquipmentButton: 'Save equipment',

        // 15. Translations used in the form
        // validation alerts.
        incompleteFieldsTitle: 'Incomplete fields',
        incompleteFieldsMessage:
            'Complete all required fields and select a photo.',
        validDataTitle: 'Valid data',
        validDataMessage:
            'The equipment information was validated successfully.',

        // 16. Traducciones utilizadas en las pestañas
        // principales de navegación.
        homeTab: 'Home',
        equipmentTab: 'Equipment',
        profileTab: 'Profile',

        // 18. Translations used in the validation
        // messages of the CustomInput component.
        invalidEmail: 'Invalid email address',
        shortPassword: 'Password is too short',
        invalidPhone: 'Invalid phone number',
        requiredField: 'This field is required',

        // 19. Translations used to display
        // the equipment status.
        statusActive: 'Available',
        statusWorkshop: 'Maintenance',
        statusInactive: 'Inactive',
        statusInUse: 'In use',

        // 20. Number of results shown in the inventory.
        resultsLabel: "Results",

        // 21. Title for the section containing the general equipment information.
        equipmentInformationTitle: "Equipment information",

        // 22. Texts used in the search bar and advanced filters.
        equipmentSearchPlaceholder: "Search equipment...",
        advancedFiltersTitle: "Advanced filters",
        advancedFiltersDescription: "Filter equipment by branch, department or brand.",
        branchFilterTitle: "Branch",
        departmentFilterTitle: "Department",
        brandFilterTitle: "Brand",
        allFeminine: "All",
        allMasculine: "All",
        clearFiltersButton: "Clear filters",

        //23. Texts used in the actions available from the equipment detail.
        quickActionsTitle: "Quick actions",
        maintenanceAction: "Maintenance",
        historyAction: "History",
        changeLocationAction: "Reassign equipment",
        qrAction: "QR Code",

        //24.Texts used when changing an equipment location.
        currentLocationLabel: "Current location",
        newBranchLabel: "New branch",

        //25. Text used when selecting the new department.
        newDepartmentLabel: "New department",

        // 26. Texts used when saving a new location.
        saveLocationButton: "Save location",
        selectDepartmentMessage: "Select a department before saving.",
        locationUpdatedTitle: "Location updated",
        locationUpdatedMessage: "The equipment location was updated successfully.",

        //27. Texts related to the QR code and its printing
        qrCode: "QR Code",
        printQr: "Print / Reprint QR",
        qrPreview: "Label preview",
        qrPreviewDescription: "This label can be printed again when the physical QR code needs to be replaced.",
        cancel: "Cancel",
        print: "Print",
        printLabelTitle: "Print label",
        printLabelMessage: "The QR label for equipment",
        printLabelMessageEnd: "will be prepared for printing.",

        //28. Equipment history screen texts
        equipmentHistoryTitle: "Equipment history",
        registeredMovements: "Registered movements:",
        previousLocation: "Previous location",
        newLocation: "New location",
        noMovementsTitle: "No movements recorded",
        noMovementsMessage: "Location changes made to this equipment will appear here.",

        //29. Texts used to deactivate equipment.
        decommissionButton: "Deactivate equipment",
        decommissionTitle: "Deactivate equipment",
        decommissionMessageStart: "Are you sure you want to deactivate equipment",
        decommissionMessageEnd: "? The equipment will remain registered and keep its history.",
        decommissionConfirm: "Deactivate",
        decommissionSuccessTitle: "Equipment deactivated",
        decommissionSuccessMessageStart: "Equipment",
        decommissionSuccessMessageEnd: "was deactivated successfully.",

        //30. Texts used to capture equipment photos.
        takePhotoButton: "Take photo",
        cameraPermissionTitle: "Permission required",
        cameraPermissionMessage: "You must allow camera access to take a photo.",

        //31. Message displayed when attempting to save a reassignment without changes.
        noChangesTitle: "No changes",
        noChangesMessage: "No changes were made.",

        //32. Texts used to reactivate decommissioned equipment.
        reactivateButton: "Reactivate equipment",
        reactivateTitle: "Reactivate equipment",
        reactivateMessageStart: "Are you sure you want to reactivate equipment",
        reactivateMessageEnd: "? Its previous status will be restored.",
        reactivateConfirm: "Reactivate",
        reactivateSuccessTitle: "Equipment reactivated",
        reactivateSuccessMessageStart: "Equipment",
        reactivateSuccessMessageEnd: "was reactivated successfully.",

        //33. Texts used to edit equipment information.
        editEquipmentTitle: "Edit equipment",
        saveChangesButton: "Save changes",
        editEquipmentSuccessTitle: "Equipment updated",
        editEquipmentSuccessMessage: "The equipment information was updated successfully.",


        // 34. Validation to prevent duplicate serial numbers.
        duplicateSerialTitle: "Duplicate serial number",
        duplicateSerialMessage: "A device with this serial number is already registered.",


        // 35. Filters used in the equipment history.
        maintenanceHistoryFilter: "Maintenance",
        locationsHistoryFilter: "Locations",

        //36. Event types displayed in the equipment history.
        locationChangeEvent: "Location change",
        responsibleChangeEvent: "Responsible person change",

        // 37. Compact labels used in the history timeline.
        historyFromLabel: "From",
        historyToLabel: "To",

        // 38. Empty states for history filters.
        noMaintenanceHistoryTitle: "No maintenance records",
        noMaintenanceHistoryMessage: "Maintenance performed on this equipment will appear here.",

        noStatusHistoryTitle: "No status changes recorded",
        noStatusHistoryMessage: "Deactivations and reactivations for this equipment will appear here.",

        //39.x Texts used to display status changes in the equipment history.
        equipmentDeactivatedEvent: "Equipment deactivated",
        equipmentReactivatedEvent: "Equipment reactivated",
        statusChangeLabel: "Status",

        //40. Additional information displayed in equipment history events.
        performedByLabel: "Performed by",
        reasonLabel: "Reason",


        //Texts used in the maintenance module.
        maintenanceTab: "Maintenance",
        maintenanceTitle: "Maintenance",
        maintenanceAll: "All",
        maintenanceInProgress: "In progress",
        maintenanceCompleted: "Completed",
        maintenanceTechnicianLabel: "Technician",
        maintenanceTypePreventive: "Preventive",
        maintenanceTypeCorrective: "Corrective",
        maintenancePriorityLabel: "Priority",
        maintenancePriorityLow: "Low",
        maintenancePriorityMedium: "Medium",
        maintenancePriorityHigh: "High",
        newMaintenanceButton: "New maintenance",
        newMaintenanceTitle: "New maintenance",
        maintenanceDescriptionPlaceholder: "Work description",
        maintenancePartsTitle: "Parts used",
        maintenancePartNamePlaceholder: "Part name",
        maintenancePartQuantityPlaceholder: "Quantity",
        addPartButton: "Add part",
        saveMaintenanceButton: "Save maintenance",
        finalizeMaintenanceButton: "Finalize maintenance",
        noMaintenancesTitle: "No maintenance records",
        noMaintenancesMessage: "There are no maintenance records in this category.",

        // Additional texts used in the maintenance form and details.
        maintenanceChecklistTitle: "Checklist",
        maintenanceChecklistInternalCleaning: "Internal cleaning",
        maintenanceChecklistHardwareReview: "Hardware inspection",
        maintenanceChecklistSoftwareUpdate: "Software update",
        maintenanceChecklistFunctionTests: "Functionality testing",
        maintenanceChecklistGeneralObservations: "General observations",

        maintenanceFinalStatusLabel: "Final status",
        maintenanceStatusOperational: "Operational",
        maintenanceStatusFollowUp: "Requires follow-up",
        maintenanceStatusOutOfService: "Out of service",

        maintenanceDecommissionReasonLabel: "Deactivation reason",
        maintenanceDecommissionReasonPlaceholder: "E.g. Irreversible motherboard damage",

        maintenanceStartProcessButton: "Start process",
        maintenanceSaveChangesButton: "Save changes",
        maintenanceGeneratePdfButton: "Generate maintenance PDF",

        maintenanceInvalidQuantityTitle: "Invalid quantity",
        maintenanceInvalidQuantityMessage: "The part quantity must be a whole number greater than zero.",
        maintenanceFinalStatusRequiredTitle: "Final status required",
        maintenanceFinalStatusRequiredMessage: "Select the final equipment status before completing the maintenance.",

        maintenanceSignatureLabel: "Acceptance signature",
        maintenanceSignedOnLabel: "Signed on",

        // Maintenance certificate and signature texts.
        maintenanceCertificateTitle: "Maintenance certificate",
        maintenanceCertificateInstructions:
            "The employee assigned to the equipment must sign to confirm receipt and acceptance of the maintenance performed.",

        maintenanceInfoTitle: "Maintenance information",
        maintenanceEquipmentLabel: "Equipment",
        maintenanceBrandModelLabel: "Brand / model",
        maintenanceTypeLabel: "Type",
        maintenanceResultLabel: "Result",
        maintenanceNotSpecified: "Not specified",

        maintenanceWorkPerformedLabel: "Work performed",
        maintenanceCompletedTasksLabel: "Completed tasks",
        maintenanceNoTasks: "No tasks recorded.",
        maintenancePartsUsedLabel: "Parts used",
        maintenanceQuantityLabel: "Quantity",
        maintenanceNoParts: "No parts were used.",

        maintenanceSignatureRequiredFrom: "Signature required from",
        maintenanceClearSignatureButton: "Clear",
        maintenanceConfirmSignatureButton: "Confirm signature",
        maintenanceSavingSignatureButton: "Saving...",

        maintenanceSignatureRequiredTitle: "Signature required",
        maintenanceSignatureRequiredMessage: "You must sign before continuing.",
        maintenanceSignatureCaptureError: "The signature could not be captured. Please try again.",
        maintenanceSignatureSaveError: "There was a problem saving the signature.",

        maintenanceUnassignedEmployee: "Unassigned",
        maintenanceDefaultDecommissionReason:
            "Permanent damage detected during maintenance",


        // QR scanner and manual equipment entry texts.
        maintenanceScannerTitle: "Scan equipment",
        maintenanceScannerInstruction: "Center the QR code inside the frame",

        maintenanceEnterCodeLabel: "Enter the equipment code (EQ-xxxxx)",
        maintenanceContinueButton: "Continue",
        maintenanceBackToScannerButton: "Scan again",
        maintenanceEnterCodeManuallyButton: "Enter code manually",

        maintenanceCameraPermissionMessage:
            "We need access to your camera to scan the equipment QR code.",
        maintenanceAllowCameraButton: "Allow camera",

        maintenanceEquipmentNotFoundTitle: "Equipment not found",
        maintenanceEquipmentNotFoundMessage: "Verify that the equipment code is correct.",

        maintenanceInactiveEquipmentTitle: "Equipment deactivated",
        maintenanceInactiveEquipmentMessage:
            "Equipment __CODIGO__ is deactivated and cannot receive maintenance.",

        maintenanceAlreadyInProgressTitle: "Maintenance in progress",
        maintenanceAlreadyInProgressMessage:
            "Equipment __CODIGO__ already has a maintenance in progress. You must complete it before starting another.",

        maintenanceCancelButton: "Cancel",
        maintenanceOpenExistingButton: "Open maintenance",

        // Specific empty-state messages for each Maintenance tab.
        noMaintenancesAllTitle: "No maintenance records",
        noMaintenancesAllMessage: "There are no maintenance records yet.",

        noMaintenancesInProgressTitle: "No maintenance in progress",
        noMaintenancesInProgressMessage: "There are no maintenance jobs waiting to be completed.",

        noMaintenancesCompletedTitle: "No completed maintenance",
        noMaintenancesCompletedMessage: "There are no completed maintenance records yet.",

        // Date range filter for Maintenance.
        maintenanceDateFilterButton: "Filter by date",
        maintenanceDateFrom: "From",
        maintenanceDateTo: "To",
        maintenanceDateSelect: "Select date",

        // Actions shown after signing and completing the maintenance.
        maintenanceFinishedTitle: "Maintenance completed",
        maintenancePdfReadyMessage:
            "The PDF certificate was generated successfully. You can share it now or close to return to Maintenance.",
        maintenanceShareCertificateButton: "Share certificate",
        maintenanceCloseButton: "Close",

        // Error while automatically generating the certificate after completion.
        maintenancePdfGenerationErrorTitle: "Certificate could not be generated",
        maintenancePdfGenerationErrorMessage:
            "The maintenance was completed successfully, but the PDF could not be generated. You can generate it later from the maintenance details.",


        // Translations used on the Reports screen.
        reportsTab: 'Reports',
        reportsTitle: 'Reports',
        reportsUpdating: 'Updating report...',
        reportsLoadError: 'The report data could not be loaded.',

        reportsPeriodTitle: 'Report period',
        reportsPeriodCurrentMonth: 'This month',
        reportsPeriodLast30Days: 'Last 30 days',
        reportsPeriodCurrentYear: 'This year',
        reportsPeriodAllHistory: 'All history',

        reportsRegisteredEquipment: 'Registered equipment',
        reportsInUse: 'In use',
        reportsAvailable: 'Available',
        reportsMaintenance: 'Maintenance',
        reportsDecommissioned: 'Decommissioned',

        reportsEquipmentByStatus: 'Equipment by status',
        reportsMaintenanceByType: 'Maintenance by type',
        reportsEquipmentByBranch: 'Equipment by branch',

        reportsPreventive: 'Preventive',
        reportsCorrective: 'Corrective',
        reportsInactive: 'Decommissioned',

        reportsNoEquipment: 'No equipment was registered during this period.',
        reportsNoMaintenance: 'No maintenance was registered during this period.',

        reportsExportExcel: 'Export to Excel',
        reportsExportingExcel: 'Generating Excel...',
        reportsNoExportDataTitle: 'No information',
        reportsNoExportDataMessage: 'There is no data to export for the selected period.',
        reportsExportErrorTitle: 'Error',
        reportsExportErrorMessage: 'The Excel file could not be generated.',

        reportsUnidentified: 'Unidentified',
        reportsUnassigned: 'Unassigned',

        // ==================== PROFILE - SECONDARY SCREENS ====================

        // Edit profile
        editProfileTitle: 'My Profile',
        editProfilePhotoHint: 'Tap the photo to change it',
        editProfileRoleLabel: 'Role',
        editProfileMemberSince: 'Member since',
        editProfileFullNameLabel: 'Full name',
        editProfileNamePlaceholder: 'Your name',
        editProfileEmailLabel: 'Email',
        editProfileSaving: 'Saving changes...',
        editProfileSaveButton: 'Save changes',

        editProfilePermissionTitle: 'Permission required',
        editProfilePermissionMessage: 'We need access to your gallery to choose a photo.',
        editProfileImageErrorTitle: 'Image unavailable',
        editProfileImageErrorMessage: 'The image could not be prepared for saving.',
        editProfileRequiredTitle: 'Required field',
        editProfileRequiredMessage: 'Enter your full name.',
        editProfileUpdatedTitle: 'Profile updated',
        editProfileUpdatedMessage: 'Your changes were saved successfully.',
        editProfileErrorTitle: 'Profile could not be updated',
        editProfileErrorMessage: 'Your profile could not be updated.',

        // Change password
        changePasswordTitle: 'Change password',
        changePasswordSubtitle: 'Update your account password',
        changePasswordSecurityMessage: 'For security, you must confirm your current password before setting a new one.',
        changePasswordCurrentLabel: 'Current password',
        changePasswordCurrentPlaceholder: 'Enter your current password',
        changePasswordNewLabel: 'New password',
        changePasswordNewPlaceholder: 'Minimum 8 characters',
        changePasswordConfirmLabel: 'Confirm new password',
        changePasswordConfirmPlaceholder: 'Repeat the new password',
        changePasswordUpdating: 'Updating password...',
        changePasswordButton: 'Change password',

        changePasswordRequiredTitle: 'Required fields',
        changePasswordRequiredMessage: 'Complete your current password, new password and confirmation.',
        changePasswordShortTitle: 'Password too short',
        changePasswordShortMessage: 'The new password must contain at least 8 characters.',
        changePasswordMismatchTitle: 'Passwords do not match',
        changePasswordMismatchMessage: 'The confirmation must match the new password.',
        changePasswordSameTitle: 'Password unchanged',
        changePasswordSameMessage: 'The new password must be different from the current password.',
        changePasswordSessionTitle: 'Session unavailable',
        changePasswordSessionMessage: 'Your current session could not be verified.',
        changePasswordIncorrectTitle: 'Incorrect password',
        changePasswordIncorrectMessage: 'The current password you entered is incorrect.',
        changePasswordErrorTitle: 'Password could not be changed',
        changePasswordErrorMessage: 'The password could not be changed at this time.',
        changePasswordSuccessTitle: 'Password updated',
        changePasswordSuccessMessage: 'Your password was changed successfully.',
        commonAccept: 'OK',

        // Users
        usersTitle: 'Users and technicians',
        usersAll: 'All',
        usersTechnicians: 'Technicians',
        usersAdmins: 'Admins',
        usersEmailLabel: 'Email',
        usersRoleLabel: 'Role',
        usersTechnicianRole: 'Technician',
        usersAdministratorRole: 'Administrator',
        usersTechnicianBadge: 'TECHNICIAN',
        usersAdminBadge: 'ADMIN',
        usersRegisterButton: 'Register user',

        // Register user
        newUserTitle: 'Register user',
        newUserEmployeeLabel: 'Employee',
        newUserSelectEmployee: 'Select employee',
        newUserEmailLabel: 'Email',
        newUserTemporaryPasswordLabel: 'Temporary password',
        newUserPasswordPlaceholder: 'Minimum 8 characters',
        newUserConfirmPasswordLabel: 'Confirm password',
        newUserRepeatPasswordPlaceholder: 'Repeat password',
        newUserTypeLabel: 'User type',
        newUserTechnician: 'Technician',
        newUserAdministrator: 'Administrator',
        newUserCreating: 'Creating account...',
        newUserCreateButton: 'Create user',
        newUserSelectEmployeeTitle: 'Select employee',
        newUserNoEmployees: 'There are no employees available to create an account.',

        newUserEmployeeRequiredTitle: 'Employee required',
        newUserEmployeeRequiredMessage: 'Select the employee who will own this account.',
        newUserInvalidEmailTitle: 'Invalid email',
        newUserInvalidEmailMessage: 'Enter a valid email address.',
        newUserExistingEmailTitle: 'Email already registered',
        newUserExistingEmailMessage: 'An account with this email already exists.',
        newUserInvalidPasswordTitle: 'Invalid password',
        newUserInvalidPasswordMessage: 'The temporary password must contain at least 8 characters.',
        newUserMismatchTitle: 'Passwords do not match',
        newUserMismatchMessage: 'The password and confirmation must match.',
        newUserCreatedTitle: 'User created',
        newUserCreatedPrefix: 'The account for',
        newUserCreatedSuffix: 'was created successfully.',
        newUserErrorTitle: 'User could not be created',
        newUserErrorMessage: 'The account could not be created.',

        // Branches and departments
        locationsTitle: 'Branches',
        locationsSubtitle: 'Location management',

        locationsRestrictedTitle: 'Restricted access',
        locationsBranchRestrictedMessage: 'Only an administrator can register new branches.',
        locationsDepartmentRestrictedMessage: 'Only an administrator can register departments.',

        locationsNameRequiredTitle: 'Name required',
        locationsBranchNameMessage: 'Enter a valid branch name.',
        locationsBranchExistingTitle: 'Branch already exists',
        locationsBranchExistingMessage: 'A branch with this name is already registered.',
        locationsBranchCreatedTitle: 'Branch created',
        locationsRegisteredSuffix: 'was registered successfully.',
        locationsBranchErrorTitle: 'Branch could not be created',
        locationsBranchErrorMessage: 'The branch could not be registered.',

        locationsNewBranchTitle: 'New branch',
        locationsNewBranchDescription: 'Register a new company location.',
        locationsBranchNameLabel: 'Branch name',
        locationsBranchPlaceholder: 'E.g. San Pedro Sula Branch',
        locationsRegisteringBranch: 'Registering branch...',
        locationsCreateBranchButton: 'Create branch',
        locationsRegisteredBranches: 'Registered branches',
        locationsBranchSingular: 'branch',
        locationsBranchPlural: 'branches',
        locationsNoBranches: 'No branches have been registered.',

        locationsDepartmentRequiredTitle: 'Branch required',
        locationsDepartmentRequiredMessage: 'Select the branch this department belongs to.',
        locationsDepartmentNameMessage: 'Enter a valid department or area name.',
        locationsDepartmentExistingTitle: 'Department already exists',
        locationsDepartmentExistingMessage: 'This branch already has a department or area with this name.',
        locationsDepartmentCreatedTitle: 'Department created',
        locationsDepartmentErrorTitle: 'Department could not be created',
        locationsDepartmentErrorMessage: 'The department could not be registered.',

        locationsNewDepartmentTitle: 'New department or area',
        locationsNewDepartmentDescription: 'First select the branch it belongs to.',
        locationsBranchLabel: 'Branch',
        locationsSelectBranch: 'Select branch',
        locationsDepartmentLabel: 'Department or area',
        locationsDepartmentPlaceholder: 'E.g. Accounting',
        locationsRegisteringDepartment: 'Registering department...',
        locationsCreateDepartmentButton: 'Create department',
        locationsRegisteredDepartments: 'Registered departments and areas',
        locationsDepartmentSingular: 'department',
        locationsDepartmentPlural: 'departments',
        locationsNoDepartments: 'No departments have been registered.',
        locationsBranchUnavailable: 'Branch unavailable',
        locationsSelectBranchTitle: 'Select branch',
        locationsRegisterBranchFirst: 'You must register a branch first.',

        // Employees
        employeesAccessTitle: 'Restricted access',
        employeesAccessMessage: 'This section is available only to administrators.',
        employeesBackButton: 'Go back',
        employeesTitle: 'Employees',
        employeesSubtitle: 'Employee management',
        employeesRegisterTitle: 'Register employee',
        employeesRegisterDescription: 'Assign the employee to a branch and department.',
        employeesFullNameLabel: 'Full name',
        employeesNamePlaceholder: 'E.g. John Smith',
        employeesBranchLabel: 'Branch',
        employeesSelectBranch: 'Select branch',
        employeesDepartmentLabel: 'Department or area',
        employeesSelectDepartment: 'Select department',
        employeesRegistering: 'Registering employee...',
        employeesRegisterButton: 'Register employee',
        employeesRegisteredTitle: 'Registered employees',
        employeesSingular: 'employee',
        employeesPlural: 'employees',
        employeesDepartmentUnavailable: 'Department unavailable',
        employeesBranchUnavailable: 'Branch unavailable',
        employeesEmpty: 'No employees have been registered.',
        employeesSelectBranchTitle: 'Select branch',
        employeesSelectDepartmentTitle: 'Select department',
        employeesNoDepartments: 'This branch does not have any registered departments yet.',

        employeesRestrictedMessage: 'Only an administrator can register employees.',
        employeesNameRequiredTitle: 'Name required',
        employeesNameRequiredMessage: 'Enter the employee’s full name.',
        employeesBranchRequiredTitle: 'Branch required',
        employeesBranchRequiredMessage: 'Select the branch where the employee works.',
        employeesDepartmentRequiredTitle: 'Department required',
        employeesDepartmentRequiredMessage: 'Select the employee’s department or area.',
        employeesCreatedTitle: 'Employee created',
        employeesCreatedSuffix: 'was registered successfully.',
        employeesErrorTitle: 'Employee could not be created',
        employeesErrorMessage: 'The employee could not be registered.',
        employeesSelectBranchFirstTitle: 'Select a branch',
        employeesSelectBranchFirstMessage: 'You must first select the employee’s branch.',
    },
};
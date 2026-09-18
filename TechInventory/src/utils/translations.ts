
// 1. Creamos el objeto que contendrá todas las traducciones
export const translations = {

    // 2. Traducciones correspondientes al idioma español.
    es: {
        profile: 'Mi Perfil',
        technicianRole: 'Técnico de mantenimiento',
        darkMode: 'Modo oscuro',
        logout: 'Cerrar sesión',
        languageLabel: 'Idioma',

        // 4. Traducciones utilizadas en la pantalla de inicio de sesión.
        loginSubtitle: 'Inicia sesión para continuar',
        emailPlaceholder: 'Correo electrónico',
        passwordPlaceholder: 'Contraseña',
        loginButton: 'Ingresar',

        // 6. Traducciones utilizadas en la pantalla de inicio.
        homeTitle: 'Bienvenido a TechInventory',
        homeDescription: 'Control de inventario, ubicación y mantenimiento de equipos',

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



    },


    // 3. Traducciones correspondientes al idioma inglés.
    en: {
        profile: 'My Profile',
        technicianRole: 'Maintenance Technician',
        darkMode: 'Dark mode',
        logout: 'Log out',
        languageLabel: 'Language',

        // 5. Traducciones utilizadas en la pantalla de inicio de sesión.
        loginSubtitle: 'Sign in to continue',
        emailPlaceholder: 'Email address',
        passwordPlaceholder: 'Password',
        loginButton: 'Sign in',

        // 7. Traducciones utilizadas en la pantalla de inicio.
        homeTitle: 'Welcome to TechInventory',
        homeDescription: 'Equipment inventory, location and maintenance control',

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


    },
};

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
        statusActive: 'Activo',
        statusWorkshop: 'Taller',
        statusInactive: 'Baja',

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
        noChangesMessage: "No se realizó ningún cambio en la ubicación o empleado asignado.",

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

        //34. Textos utilizados en el modulo de mantenimiento.
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
        statusActive: 'Active',
        statusWorkshop: 'Workshop',
        statusInactive: 'Inactive',

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
        noChangesMessage: "No changes were made to the location or assigned employee.",

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

        //34. Texts used in the maintenance module.
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

    },
};
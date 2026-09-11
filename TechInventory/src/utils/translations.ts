
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
        changeLocationAction: "Cambiar ubicación",
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
        changeLocationAction: "Change location",
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


    },
};
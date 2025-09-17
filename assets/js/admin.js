$(document).ready(function () {
    $('#example').DataTable({
        // Configuración del lenguaje (español)
        "language": {
            "lengthMenu": "Mostrar _MENU_ registros por página",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando página _PAGE_ de _PAGES_",
            "infoEmpty": "No hay registros disponibles",
            "infoFiltered": "(filtrado de _MAX_ registros totales)",
            "search": "Buscar:",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },

        // Configuración de responsive design
        "responsive": true,

        // Ordenamiento inicial
        "order": [[0, 'asc']],

        // Longitud de página por defecto
        "pageLength": 10,

        // Opciones de longitud de página
        "lengthMenu": [5, 10, 25, 50, 100],

        // Deshabilitar ordenamiento en algunas columnas si es necesario
        // "columnDefs": [
        //     { "orderable": false, "targets": [2, 3] }
        // ],

        // Estado de guardado (recuerda configuración del usuario)
        "stateSave": true,

        // Procesamiento del servidor para grandes datasets
        // "processing": true,
        // "serverSide": true,
        // "ajax": "ruta/al/archivo.php"
    });
});
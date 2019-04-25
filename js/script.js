$( document ).ready(function() {
    
    //получение значения куки
    function getCookie( name ) {
        var matches = document.cookie.match(new RegExp( "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)") );
        return matches ? decodeURIComponent(matches[1]) : undefined
    }

    //изменение фильтра
    $('.filter').change(function(){
        getList( getCookie( 'page' ) );
    })

    //удаление строки
    const deleteCompany = ( id ) => {

        let request = {
            id: id
        }

        request = JSON.stringify( request );

        document.cookie = "request=" + request;
        document.cookie = "command=delete";

        $.ajax({
              url: 'php/main.php',
              success: function( resp ){
                for ( let i = 0; i < 10; i++ ){
                    document.cookie = i.toString() + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                }
                getList( getCookie( 'page' ) );
              }
        });
    }

    //update company
    const updateCompany = ( id, name, boss, post, addr ) => {
        let request = {
            id: id,
            c_name: name,
            c_boss: boss,
            c_post: post,
            c_addr: addr
        }

        request = JSON.stringify( request );

        document.cookie = "request=" + request;
        document.cookie = "command=update";

        $.ajax({
              url: 'php/main.php',
        });
    }

    //Получение листа
    const getList = ( page ) => {

        let request = {
            page: page,
            sort: $('#sort').val(),
            dir: $('#dir').val()
        }

        if ( request.page == 0 ){ request.page = 1 }

        request = JSON.stringify( request );

        document.cookie = "request=" + request;
        document.cookie = "command=get";

        $.ajax({
            url: 'php/main.php',
            success: function(){

                document.cookie = 'page=' + page;

                $('#list').html('');
                let list = '';
                
                for ( let i = 0; i < 10; i++ ){
                    let tmp = getCookie( i.toString() );

                    if ( tmp ){

                        tmp = JSON.parse( tmp );

                        list = list + '<tr>';
                        list = list + '<td><input type="text" class="form-control" value="' + weDontWantPlus( tmp.c_name ) + '" id="c_name' + tmp.id + '"></td>';
                        list = list + '<td><input type="text" class="form-control" value="' + weDontWantPlus( tmp.c_boss ) + '" id="c_boss' + tmp.id + '"></td>';
                        list = list + '<td><input type="text" class="form-control" value="' + weDontWantPlus( tmp.c_post ) + '" id="c_post' + tmp.id + '"></td>';
                        list = list + '<td><input type="text" class="form-control" value="' + weDontWantPlus( tmp.c_addr ) + '" id="c_addr' + tmp.id + '"></td>';
                        list = list + '<td><button type="button" class="btn btn-success update" data-id="' + tmp.id + '">Update</button></td>';
                        list = list + '<td><button type="button" class="btn btn-danger delete" data-id="' + tmp.id + '">Delete</button></td>';
                        list = list + '</tr>';
                    }
                }

                $('#list').html(list);

                
                $('.delete').click(function(){
                    let id = $(this).data('id');
                    deleteCompany( id );
                })		

                $('.update').click(function(){
                    let id = $(this).data('id');
                    updateCompany( id, $('#c_name' + id).val(), $('#c_boss' + id).val(), $('#c_post' + id).val(), $('#c_addr' + id).val() );
                })						

                if ( Number( getCookie( 'pages' ) ) < Number( getCookie( 'page' ) ) ){
                    getList( getCookie( 'pages' ) );
                }

                $('.pagination').bootpag( { total: +getCookie( 'pages' ), maxVisible: 10, leaps: true, firstLastUse: true, first: '←', last: '→', } );
                $('.pagination li').addClass('page-item');
                $('.pagination a').addClass('page-link');
            }
        });
    }
    
    //Инициализация пагинации, указание ф-ии нажатия страницы
    $('.pagination').bootpag({}).on("page", function( event, num ){
        for ( let i = 0; i < 10; i++ ){
            document.cookie = i.toString() + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        getList( num );
    });
    
    //Создание записи
    $('#createNewCompany').click(function(){
        let request = {
            c_name: encodeURI( $('#c_name').val() ),
            c_boss: encodeURI( $('#c_boss').val() ),
            c_post: encodeURI( $('#c_post').val() ),
            c_addr: encodeURI( $('#c_addr').val() ),
        }

        request = JSON.stringify( request );

        document.cookie = "request=" + request;
        document.cookie = "command=create";

        $.ajax({
            url: 'php/main.php',
            success: function( resp ){
                getList( getCookie( 'page' ) );
            }
        });
    }) 

    //открытие окна по нажатию кнопки
    $('#modalShow').click(function(){
        $('#exampleModal').modal('show');
        $('#c_name').val('');
        $('#c_boss').val('');
        $('#c_post').val('');
        $('#c_addr').val('');
    })

    //мыНеХотимПлюс
    const weDontWantPlus = (msg) => Array.prototype.map.call( msg, ( item ) => {
        if ( item == '+' ) {
            return ' '
        }
        return item;
    }).join('');

    //Первый запрос
    getList( 1 );
});
<?php
    class Helper{

        private $link;

	    function __construct() {
		    $this->link = mysqli_connect( "127.0.0.1", "root", "", "swansoft" );
		    mysqli_set_charset( $this->link, "utf8" );
        }

        //обновление записи
        public function update( $req ){
            $values = [];
            $result = [];

            $sql = 'UPDATE innovatek SET c_name="%s", c_boss="%s", c_post="%s", c_addr="%s" WHERE id="%s"';

            foreach ( $req as $i => $value ) {
                $values[$i] = mysqli_real_escape_string( $this->link, $value );
            }

            $sql = sprintf( $sql, $values['c_name'], $values['c_boss'], $values['c_post'], $values['c_addr'], $values['id'] );

            if ( !mysqli_query( $this->link, $sql ) ){
                $result['error'] = mysqli_errno($this->link) . ' ' . mysqli_error($this->link);
                $result['success'] = false;
            } else {
                $result['success'] = true;
            }

            return $result;
        }

        //удаление записи
        public function delete( $req ){
            $result = [];

            $sql = 'DELETE FROM innovatek WHERE id = "%s"';
            $sql = sprintf( $sql, mysqli_real_escape_string( $this->link, $req['id'] ) );

            if ( !mysqli_query( $this->link, $sql ) ){
                $result['error'] = mysqli_errno($this->link) . ' ' . mysqli_error($this->link);
                $result['success'] = false;
            } else {
                $result['success'] = true;
            }

            return $result;
        }
        
        //получение списка
        public function get( $req ){
            $result  = [];
            $columns = [];

            $count = mysqli_query( $this->link, 'SELECT * FROM innovatek' );

            if ( !$count ){
                $result['error'] = mysqli_errno($this->link) . ' ' . mysqli_error($this->link);
                $result['success'] = false;
                return $result;
            }

            $offset = ( $req['page'] - 1 ) * 10;

            $sql = 'SELECT * FROM innovatek ORDER BY %s %s LIMIT 10 OFFSET %s';
            $sql = sprintf( $sql, mysqli_real_escape_string( $this->link, $req['sort'] ), 
                mysqli_real_escape_string( $this->link, $req['dir'] ), mysqli_real_escape_string( $this->link, $offset ) );
            
            $list = mysqli_query( $this->link, $sql );

            if ( !$list ){
                $result['error'] = mysqli_errno($this->link) . ' ' . mysqli_error($this->link);
                $result['success'] = false;
                return $result;
            }

            foreach ( mysqli_fetch_fields( $list ) as $col ){
                array_push( $columns, $col->name );
            }

            $result['pages'] = ceil( mysqli_num_rows( $count )/10 );

            while ( $row = mysqli_fetch_row( $list ) ) {
                $tmp = [];

                foreach ( $row as $key => $value ) {
                    $tmp[$columns[$key]] = $value;
                }

                array_push( $result, $tmp );
            }

            $result['success'] = true;
 
            return $result;
        }

        //создание новой записи
        public function create( $req ){
            $values = [];
            $result = [];

            $sql = 'INSERT INTO innovatek (c_name,c_boss,c_post,c_addr) VALUES ("%s","%s","%s","%s")';

            foreach ( $req as $i => $value ) {
                $values[$i] = mysqli_real_escape_string( $this->link, $value );
            }

            $sql = sprintf( $sql, $values['c_name'], $values['c_boss'], $values['c_post'], $values['c_addr'] );

            if ( !mysqli_query( $this->link, $sql ) ){
                $result['error'] = mysqli_errno($this->link) . ' ' . mysqli_error($this->link);
                $result['success'] = false;
            } else {
                $result['success'] = true;
            }

            return $result;
        }
    }
?>
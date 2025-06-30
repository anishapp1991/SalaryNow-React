import React from 'react';
import{StyleSheet, View, Text} from 'react-native';

const RFID=()=>{

    return(
        <View style={styles.container}>
            <Text style={styles.text}>Empty RFID Cards</Text>         
        </View>
    )
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FFFF'
    },
    text:{
        fontSize:20,
        fontWeight:'bold',
        justifyContent:'center',
        color:'#000000',
        marginHorizontal:120,
        marginTop:400
    }
})
export default RFID;
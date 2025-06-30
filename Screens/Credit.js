import React from 'react';
import{StyleSheet, View, Text} from 'react-native';

const Credit=()=>{

    return(
        <View style={styles.container}>
            <Text style={styles.text}>Empty Credits</Text>         
        </View>
    )
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#05294B'
    },
    text:{
        fontSize:20,
        fontWeight:'bold',
        justifyContent:'center',
        marginHorizontal:120,
        marginTop:400
    }
})
export default Credit;
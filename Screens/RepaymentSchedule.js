import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Head from './Header';

const ExpandableList = ({ navigation, route }) => {
    const [expanded, setExpanded] = useState(null);
    const [loans, setLoans] = useState(route?.params?.data || '');
    console.log(loans)

    const toggleExpand = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity style={styles.header1} onPress={() => toggleExpand(index)}>
                <View style={styles.header} >
                    <Text style={styles.title}>₹ {item.amount}</Text>
                    {item.status === '1' ? (
                        <Text style={styles.value1}>Partial Payment</Text>
                    ) : item.status === '2' ?
                        <Text style={styles.value2}>Paid</Text>
                        : null}
                    <Ionicons name={expanded === index ? 'chevron-up' : 'chevron-down'} size={24} color="gray" />
                </View>
                <Text style={styles.title1}>{item.duedate}</Text>
            </TouchableOpacity>
            {expanded === index && (
                <View style={styles.content}>
                    <View style={styles.header} >
                        <Text style={{color:'#000'}}>Actual EMI Amount</Text>
                        <Text style={{color:'#000'}}> ₹ {item.emi_amount}</Text>
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Head title="Repayment Schedule" />
            <View style={styles.container1}>
                <FlatList
                    data={loans}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
};

export default ExpandableList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container1: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#f2f2f2',
    },
    value1: {
        width: '50%', // Set width to control line break, adjust as needed
        fontSize: 12,
        fontWeight:'bold',
        textAlign: 'center',
        color: '#776fd1',
        backgroundColor: '#cdccf8',
        padding: 5,
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    value2: {
        width: '25%', // Set width to control line break, adjust as needed
        fontSize: 12,
        fontWeight:'bold',
        textAlign: 'center',
        color: '#888',
        backgroundColor: '#e5e5e5',
        padding: 5,
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },

    itemContainer: {
        borderBottomColor: '#fff',
        marginTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    header1: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000'
    },
    title1: {
        fontSize: 12,
        color: '#000',
    },
    content: {
        paddingHorizontal: 15,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
});

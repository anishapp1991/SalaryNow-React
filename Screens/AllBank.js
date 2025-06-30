import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Image
} from 'react-native';
import HTTPRequest from '../utils/HTTPRequest';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';


const BankSelectionScreen = ({navigation}) => {
    const [preferredBanks, setPreferredBanks] = useState([]);
    const [allBanks, setAllBanks] = useState([]);
    const [filteredBanks, setFilteredBanks] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchBanks = async () => {
        setLoading(true);
        try {
            const response = await HTTPRequest.getAllBanks();
            if (response.status === 200) {
                const details = response.data.response_data;
                console.log(details);
                setPreferredBanks(details.preffer_bank || []);
                setAllBanks(details.allbank || []);
                setFilteredBanks(details.allbank || []);
            } else {
                Alert.alert('Error', 'Failed to fetch bank details.');
            }
        } catch (error) {
            console.error('Error fetching banks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
        const results = allBanks.filter((bank) =>
            bank.BankName.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredBanks(results);
    };

    const renderBankItem = ({ item }) => (
        <TouchableOpacity style={styles.bankItem} onPress={() => navigation.navigate('BankEdit',{datas:item})}>
            <View style={styles.row}>
                <View style={styles.iconContainer1}>
                    <View style={styles.iconContainer}>
                        <Icons name="bank" size={15} color="#000" />
                    </View>
                </View>
                <Text
                    style={styles.bankName}
                    numberOfLines={1}  // Limit text to 1 line
                    ellipsizeMode="tail"  // Add ellipsis at the end if text overflows
                >
                    {item.BankName}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* <View style={styles.row1}> */}
            <TouchableOpacity               onPress={() => navigation.navigate('RFID')}>
            <Icon name="close" size={25} color="#000" style={styles.close} />
            </TouchableOpacity>
            <Text style={styles.title}>Select Your Bank</Text>

            {/* </View> */}
            <View style={styles.searchContainer}>
                <Icon name="search-outline" size={20} color="#000" style={styles.search} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Enter bank name"
                    value={searchText}
                    onChangeText={handleSearch}
                />
            </View>
            {searchText ?
                <>
                <View style={{marginTop:10}}>
                    <FlatList
                        data={filteredBanks}
                        keyExtractor={(item) => item.id}
                        renderItem={renderBankItem}
                    />
                    </View>
                </>
                : null
            }

            {loading ? (
                <ActivityIndicator size="large" color="#6200ee" />
            ) : (


                <ScrollView>
                    {!searchText ?
                        <>
                            <Text style={styles.sectionTitle}>Top Banks</Text>
                            <View style={styles.bankGrid}>
                                {preferredBanks.map((bank) => (
                                    <TouchableOpacity key={bank.id} style={styles.preferredBank} onPress={() => navigation.navigate('BankEdit',{datas:bank})}>
                                        <View style={styles.imgContainer}>
                                            <View style={styles.imgContainer1}>
                                                <Image
                                                    source={{ uri: bank.bank_logo }}
                                                    style={styles.bankLogo}
                                                    resizeMode="contain" // Ensures the image doesn't get stretched
                                                />
                                            </View>
                                        </View>
                                        <Text style={styles.bankText}>
                                            {bank.alias}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.sectionTitle}>All Other Banks</Text>
                            <FlatList
                                data={allBanks}
                                keyExtractor={(item) => item.id}
                                renderItem={renderBankItem}
                            />
                        </>
                        : null}
                </ScrollView>

            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 40,
    },
    close: {
        textAlign: 'right',
    },
    search: {
        marginRight: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center', // Vertically center the items (logo and text)
        marginBottom: 5, // Space between items
    },

    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    searchInput: {
        // backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 5,
        height: 40,
        // marginBottom: 10,
        flex: 1,
        height: '100%',
        color: '#000',
    },
    iconContainer1: {
        width: 40,
        height: 40,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: '#d6d6d6',
        backgroundColor: '#fcfdfe',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10, // Space between the logo and text
    },
    iconContainer: {
        width: 25,
        height: 25,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#d6d6d6',
        backgroundColor: '#e8d7ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 12,
        marginBottom: 8,
    },
    bankGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    imgContainer1: {
        width: 40,
        height: 40,
        // borderWidth: 1,
        // borderColor: '#d6d6d6',
        borderRadius: 10,
        backgroundColor: '#f6f6f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgContainer: {
        width: 55,
        height: 55,
        borderWidth: 1,
        lineHeight: 50,
        borderColor: '#d6d6d6',
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8, // Adds space between the logo and the bank name
        // elevation:5,
    },
    bankLogo: {
        width: 30,
        height: 30,  // Fixed size for the bank logos
    },
    bankText: {
        fontSize: 12,
        textAlign: 'center',
    },
    bankItem: {
        paddingVertical: 0,
        flexDirection: 'row',
        alignItems: 'center', // Align text and icon in the center
    },
    bankName: {
        fontSize: 14,
        marginLeft: 3,
        lineHeight: 40,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        height: 40,
        width: '85%',
    },
    preferredBank: {
        borderRadius: 8,
        width: '22%',
        alignItems: 'center',
        marginBottom: 12,
    },
});

export default BankSelectionScreen;

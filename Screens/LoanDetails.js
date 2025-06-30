import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Linking, ToastAndroid } from "react-native";
import Head from "./Header";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';  // Import Material Icons
import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'rn-fetch-blob';
import Ionicons from 'react-native-vector-icons/Ionicons';



const viewDocument = (items) => {
    const localFile = `${RNFetchBlob.fs.dirs.DocumentDir}/${items.filename}.pdf`;
    RNFetchBlob.config({ path: localFile })
        .fetch('GET', items.url)
        .then(() => FileViewer.open(localFile))
        .catch(error => console.error(error));
};

// const downloadDocument = (items) => {
//     const { config, fs } = RNFetchBlob;
//     let DownloadDir = fs.dirs.DownloadDir;
//     let filePath = `${DownloadDir}/${items.filename}.pdf`;
//     ToastAndroid.show('Downloading started...', ToastAndroid.SHORT);

//     config({ addAndroidDownloads: { useDownloadManager: true, title: 'Downloading', path: filePath, notification: true, overwrite: true } })
//         .fetch('GET', items.url)
//         .then(() => console.log('Download Complete', filePath))
//         .catch(error => console.error(error));
// };

const downloadDocument = (items) => {
    const { config, fs } = RNFetchBlob;
    let DownloadDir = fs.dirs.DownloadDir;
    let filePath = `${DownloadDir}/${items.filename}.pdf`;
  
    // Show toast saying download started
    ToastAndroid.show('Downloading started...', ToastAndroid.SHORT);
  
    config({
      addAndroidDownloads: {
        useDownloadManager: true,
        title: 'Downloading',
        path: filePath,
        notification: true,
        overwrite: true,
      },
    })
      .fetch('GET', items.url)
      .then(() => {
        // Show toast saying download complete
        ToastAndroid.show('PDF downloaded successfully!', ToastAndroid.SHORT);
        console.log('Download Complete', filePath);
      })
      .catch((error) => {
        console.error(error);
        // Optionally, show a failure toast here
        ToastAndroid.show('Download failed. Please try again.', ToastAndroid.LONG);
      });
  };



const LoanScreen = ({ navigation, route }) => {
    const [data, setData] = useState(route?.params?.loan || '');
    const [expanded, setExpanded] = useState(false);

    console.log(data)


    const handleAction = () => {
        const url = 'mailto:hello@salarynow.in';
        Linking.openURL(url).catch((err) => console.error('Failed to open email:', err));
    };


    return (
        <View style={styles.container} >
            {/* Active Loan Card */}
            <Head title="Current Loan Details" />
            <ScrollView style={styles.container1} contentContainerStyle={styles.scrollContainer} >

                <View style={styles.card}>
                    <View style={styles.card1}>

                        <View style={styles.rowBetween}>
                            <Text style={styles.boldText}>Loan Status</Text>
                            {data.dpdstatus == true ?
                                <View style={styles.statusContainer2}>
                                    <View style={{ width: 13, height: 13, borderRadius: 10, backgroundColor: 'red' }}></View>
                                    <Text>{data.loanmsg}</Text>
                                </View>
                                :
                                <View style={styles.statusContainer}>
                                    <View style={{ width: 13, height: 13, borderRadius: 10, backgroundColor: 'green' }}></View>
                                    <Text style={{ textAlign: 'center' }}>{data.loanmsg}</Text>
                                </View>
                            }

                        </View>
                        <View style={styles.rowBetween}>
                            <Text style={styles.text}>Loan No.</Text>
                            <Text style={styles.boldText}>{data.loanNo}</Text>
                        </View>
                        <View style={styles.rowBetween}>
                            <Text style={styles.text}>Loan Tenure</Text>
                            <Text style={styles.boldText}>{data.approved_teneur} days</Text>
                        </View>
                        <View style={styles.rowBetween}>
                            <Text style={styles.text}>Loan Amount</Text>
                            <Text style={styles.boldText}>₹ {data.approved_amt}</Text>
                        </View>
                        <View style={styles.rowBetween}>
                            <Text style={styles.text}>Repayment Amount</Text>
                            <Text style={styles.boldText}>₹  {data.repayment_amount}</Text>
                        </View>
                        <View style={styles.rowBetween}>
                            <Text style={styles.text}>Repayment Date</Text>
                            <Text style={styles.boldText}>{data.repaymentdate}</Text>
                        </View>
                    </View>
                    {data.repaybtn == true ?
                        <TouchableOpacity style={styles.buttonFilled} onPress={() => navigation.navigate('Payment')}>
                            <Text style={styles.buttonFilledText}>Repay Now</Text>
                        </TouchableOpacity>
                        : null}
                    {data.shortmsgstatus == true ?
                        <>
                            <Text style={{ textAlign: 'center', color: data.shortmsgcolor }}>{data.shortmsg}</Text>
                            {data.repaybtn == false ?
                                <TouchableOpacity style={styles.buttonFilled1} onPress={handleAction}>
                                    <Text style={styles.buttonFilledText}>Contact Us</Text>
                                </TouchableOpacity>
                                : null}
                        </>
                        : null}
                </View>


                {data.repaymentstatus == true ?
                    <View style={styles.emi}>
                        {/* Header Section */}
                        <TouchableOpacity style={styles.header} onPress={() => setExpanded(!expanded)}>
                            <Text style={styles.headerText}>Repayment Schedule</Text>
                            <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} />
                        </TouchableOpacity>

                        {/* Table Content */}
                        {expanded && (
                            <View style={styles.table}>
                                {/* Table Header */}
                                <View style={styles.row}>
                                    <Text style={[styles.cell, styles.headerCell]}>Due Date</Text>
                                    <Text style={[styles.cell, styles.headerCell]}>EMI Amount</Text>
                                    <Text style={[styles.cell, styles.headerCell]}>Status</Text>
                                </View>

                                {/* EMI Data */}
                                <FlatList
                                    data={data.reapaymentsechdule}
                                    keyExtractor={(item) => item.EMI.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.row}>
                                            <Text style={styles.cell}>{item.duedate}</Text>
                                            <Text style={styles.cell}>{item.amount}</Text>
                                            <Text style={[styles.cell, { color: item.color }]}>{item.status}</Text>
                                        </View>
                                    )}
                                />
                            </View>
                        )}
                    </View>
                    : null}


                {data.loandocsstatus == true ?
                    <View style={styles.card}>
                        <Text style={styles.headerText}>Loan Documents</Text>
                        {/* <View style={styles.card1}> */}
                                      <Text style={styles.bullet}>
                                  <Text style={styles.red}>* </Text>
                                  <Text style={styles.text2}>
                                  The password is PAN No. In capital letters.
                                  </Text>
                                </Text>
                        <FlatList
                            data={data.loandocs}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.card1}>
                                    <View style={styles.cardContent}>
                                        <View>
                                            <Text style={styles.boldText}>{item.title}</Text>
                                            <Text style={styles.boldText}>{item.date}</Text>
                                        </View>
                                        <View style={styles.iconContainer}>
                                            <TouchableOpacity onPress={() => viewDocument(item)}>
                                                <MaterialIcons name="remove-red-eye" size={24} color="black" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => downloadDocument(item)}>
                                                <MaterialIcons name="download" size={24} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                    : null}
            </ScrollView>
            {/* </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    container: { flex: 1, backgroundColor: "#FFF" },
    container1: { flex: 1, padding: 16, backgroundColor: "#FFF" },
    card: { backgroundColor: "#FFF", padding: 12, borderRadius: 10, marginBottom: 16, elevation: 5, shadowColor: '#000' },
    card1: { padding: 8, borderRadius: 10, marginBottom: 16, backgroundColor: '#F4EDFF', borderWidth: 1, borderColor: '#6E36BC' },
    card2: { padding: 8, borderRadius: 10, marginBottom: 5, backgroundColor: '#F5F5F5' },
    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
    rowBetween1: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    boldText: { fontWeight: "bold", fontSize: 14 },
    boldText1: { fontWeight: "bold", fontSize: 14, marginBottom: 10 },
    boldText2: { fontWeight: "bold", fontSize: 18, marginLeft: 10 },
    iconContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    bullet: {
        flexDirection: 'row',
        marginBottom: 15,
        marginTop:15,
      },
      red: {
        color: 'red',
        fontSize: 14,
        fontWeight: 'bold',
      },
    horizontalLine: {
        height: 1, // Thickness of the line
        backgroundColor: '#6E36BC', // Color of the line
        marginVertical: 10, // Spacing above and below the line
    },
    text: { fontSize: 14, color: "#666" },
    text2: { fontSize: 14, color: "red", fontWeight: "bold" },
    text1: { fontSize: 12, color: "#666" },
    statusContainer2: { flexDirection: "row", alignItems: "center", backgroundColor: '#FBCEB1', padding: 6, paddingHorizontal: 8, borderRadius: 15, justifyContent: 'space-between', width: '46%', elevation: 3 },

    statusContainer: { flexDirection: "row", alignItems: "center", backgroundColor: '#CBFFCB', padding: 6, borderRadius: 15, justifyContent: 'space-between', width: '40%' },
    activeText: { marginLeft: 8, color: "green", fontWeight: "bold" },
    buttonOutline: { borderWidth: 1, borderColor: "#6E36BC", paddingVertical: 7, borderRadius: 25, alignItems: "center", marginBottom: 5, width: '50%', margin: 'auto', marginTop: 20 },
    buttonOutlineText: { color: "#6E36BC", fontWeight: "bold", fontSize: 16 },
    buttonFilled: { backgroundColor: "#6E36BC", paddingVertical: 8, borderRadius: 25, alignItems: "center", marginBottom: 5, width: '65%', margin: 'auto' },
    buttonFilled1: { backgroundColor: "#6E36BC", paddingVertical: 8, borderRadius: 25, alignItems: "center", marginBottom: 5, width: '65%', margin: 'auto', marginTop: 20 },
    buttonFilledText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
    accordionItem: { borderRadius: 10, marginBottom: 8, elevation: 1, backgroundColor: '#F5F5F5', marginBottom: 15 },
    accordionHeader: { padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    expandedContent: { padding: 16, backgroundColor: '#fff', borderColor: '#EEE', borderWidth: 1 },
    arrowIcon: { marginLeft: 'auto' }, // Aligns the right arrow to the far right
    emi: {
        marginBottom: 15,
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
        elevation: 5,
        overflow: "hidden"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#fff"
    },
    headerText: {
        fontSize: 16,
        fontWeight: "bold"
    },
    table: {
        paddingHorizontal: 16,
        paddingBottom: 10
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        textAlign: 'left'
    },
    cell: {
        flex: 1,
        textAlign: 'center'
    },
    headerCell: {
        fontWeight: "bold"
    }
});

export default LoanScreen;

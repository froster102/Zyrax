import PropTypes from 'prop-types'
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { formatISODate } from '@/utils/helper';

function Invoice({ order }) {
    const styles = StyleSheet.create({
        page: {
            padding: 30,
            fontFamily: 'Helvetica',
            fontSize: 12,
            color: '#333',
        },
        section: {
            marginBottom: 10,
        },
        header: {
            fontSize: 24,
            textAlign: 'left',
            marginBottom: 20,
            fontWeight: 'bold'
        },
        textBold: {
            fontSize: 12,
            fontWeight: 'extrabold',
        },
        table: {
            display: 'table',
            width: '100%',
            margin: '20px 0',
        },
        tableRow: {
            margin: 'auto',
            flexDirection: 'row',
        },
        tableHeader: {
            margin: 'auto',
            flexDirection: 'row',
            backgroundColor: '#d4d4d4',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            marginBottom: -1,
        },
        line: {
            borderBottomWidth: 1,
            borderBottomColor: '#000',
            marginVertical: 10,
        },
        tableCol: {
            width: '20%',
            padding: 5,
            textAlign: 'center',
        },
        total: {
            fontWeight: 'bold',
            fontSize: 16,
            marginTop: 10,
        },
        rightAlign: {
            textAlign: 'right',
            marginBottom: 10,
        }
    })

    let offerTotal = 0
    let subTotal = 0

    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.header}>Invoice</Text>

                <View style={styles.section}>
                    <Text style={styles.textBold} >Order Id:{order.orderId}</Text>
                    <Text style={styles.textBold}>Order Date: {order.status}</Text>
                    <Text style={styles.textBold}>Payment Method: {order.payment.method}</Text>
                    <Text style={styles.textBold}>Invoice Date: {formatISODate(order.updatedAt)}</Text>
                    <Text style={styles.textBold}>Transaction ID: {order.payment.transactionId}</Text>
                </View>

                <View style={styles.section}>
                    <Text>Shipping Address:</Text>
                    <Text>{order.shipping.addressId.firstName} {order.shipping.addressId.lastName}</Text>
                    <Text>{order.shipping.addressId.buildingName},{order.shipping.addressId.street}</Text>
                    <Text>{order.shipping.addressId.city},{order.shipping.addressId.state},{order.shipping.addressId.pincode}</Text>
                    <Text>Phone : xxxxxxxxxx</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCol}>Product</Text>
                        <Text style={styles.tableCol}>Quantity</Text>
                        <Text style={styles.tableCol}>Unit Price</Text>
                        <Text style={styles.tableCol}>Offer Discount</Text>
                        <Text style={styles.tableCol}>Toatal Price</Text>
                    </View>
                    {order.products.map((product) => {
                        product?.appliedOfferAmount ? offerTotal += product?.appliedOfferAmount : 0
                        subTotal += product.unitPrice
                        return (
                            <View key={product._id} style={styles.tableRow}>
                                <Text style={styles.tableCol}>{product.productId.name}</Text>
                                <Text style={styles.tableCol}>{product.quantity}</Text>
                                <Text style={styles.tableCol}>{product.unitPrice}</Text>
                                <Text style={styles.tableCol}>{product.appliedOfferAmount}</Text>
                                <Text style={styles.tableCol}>{product.orderPrice}</Text>
                            </View>
                        )
                    })}
                </View>

                <View style={styles.line}></View>

                <View>
                    <Text style={styles.rightAlign}>Sub Total: {subTotal}</Text>
                    <Text style={styles.rightAlign}>Offer Discount: {offerTotal}</Text>
                    <Text style={styles.rightAlign}>Applied Coupon Discount: {order.appliedCouponAmount}</Text>
                    <Text style={styles.rightAlign}>Total Amount: {order.totalAmount}</Text>
                </View>

                <View style={styles.line}></View>

            </Page>
        </Document>
    )
}

Invoice.propTypes = {
    order: PropTypes.object
}

export default Invoice
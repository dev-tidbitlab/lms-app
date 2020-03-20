import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
} from "react-native";
import { withNavigation } from 'react-navigation'
import { Rating } from 'react-native-elements';

class BestSelling extends Component {
    renderDots() {
        return (
            <View style={{ backgroundColor: '#F00', width: 20, height: 5, borderRadius: 5, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />
        )
    }
    renderActiveDots() {
        return (
            <View style={{ backgroundColor: '#1A5566', width: 20, height: 5, borderRadius: 5, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3, }} />
        )
    }
    goToPortal(v) {
        this.props.navigation.navigate('PortalWebView',
            { portalParams: 'courseDetail/' + v.courseCode }
        );
    }
    renderSelling(item) {
        return (
            <View style={{ margin: 10, backgroundColor: '#FFF', borderRadius: 10, overflow: 'hidden', width: 280 }}>
                <TouchableOpacity onPress={() => this.goToPortal(item.item)} style={{ height: 150, width: 280 }}>
                    <Image source={item.item.courseImage ? { uri: item.item.courseImage } : null} style={{ borderColor: '#DDD', borderWidth: 1, width: null, height: null, flex: 1 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.goToPortal(item.item)} style={{ padding: 5 }}>
                    <Text style={{ fontWeight: '600', color: '#373737', fontSize: 14, paddingLeft: 5, paddingTop: 5, paddingBottom: 3, paddingRight: 5 }}>{item.item.courseName}</Text>
                    <Text style={{ fontWeight: '400', color: '#AAA', fontSize: 12, paddingLeft: 5, paddingBottom: 3, paddingRight: 5 }} numberOfLines={2}>{item.item.description}</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 15, marginTop: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 5 }}>
                            <Text style={{ fontWeight: '700', fontSize: 16, paddingRight: 5 }}>{item.item.rating}</Text>
                            <View style={{ alignItems: 'flex-start' }}>
                                <Rating type='custom' ratingBackgroundColor={'#F4F4F6'} readonly tintColor={'#FFF'} style={{ backgroundColor: '#F4F4F6', tintColor: '#F4F4F6' }} imageSize={15} fractions="{1}" startingValue={item.item.rating} />
                                <Text style={{ fontWeight: '500', color: "#AAA", fontSize: 10 }}>Based on 50 review(s)</Text>
                            </View>
                        </View>
                        <View style={{ position: 'absolute', right: 5 }}>
                            {Number(item.item.price) != Number(item.item.sellPrice) ? <Text style={{ textDecorationLine: 'line-through', color: '#AAA' }}>₹{item.item.price}</Text> : null}
                            <Text>₹{item.item.sellPrice}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    render() {
        return (
            <FlatList
                showsHorizontalScrollIndicator={false}
                data={this.props.BestSellingCourses}
                horizontal={true}
                renderItem={(item) => this.renderSelling(item)}
                keyExtractor={(item, index) => item.id}
            />
        );
    }
}
export default withNavigation(BestSelling);

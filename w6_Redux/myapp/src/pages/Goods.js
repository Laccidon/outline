import React,{Component} from 'react';

import {getData} from '../api';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Button} from 'antd-mobile';

// import {add2cart,changeQty} from '../acions';
import cartActionCreators from '../acions';


class Goods extends Component{
    state = {
        goods:{},
        commend:[]
    }
    async componentWillMount(){
        console.log(this.props)
        let {match:{params:{id}}} = this.props;
        let {data:{datas:goods}} = await getData('/index.php',{
            params:{
                act:'goods',
                op:'goods_detail',
                goods_id:id,
                key:''
            }
        })
        console.log(goods);

        this.setState({
            goods:{
                imgurl:goods.goods_image,
                info:{...goods.goods_info}
            },
            commend:goods.goods_commend_list
        })

    }

    shouldComponentUpdate(nextProps, nextState){
        return nextState.goods.info;
    }

    add2cart =()=>{
        let {goodslist,add2cart,changeQty} = this.props
        let {imgurl} = this.state.goods
        let {goods_id,goods_name,goods_promotion_price:price} = this.state.goods.info;

        // 判断商品是否存在
        // 存在：change_qty
        // 不存在：add_to_cart
        let has = goodslist.filter(item=>item.goods_id === goods_id)[0]
        if(has){
            changeQty(goods_id,has.qty+1)
        }else{

            add2cart({
                goods_id,
                goods_name,
                price,
                imgurl,
                qty:1
            })
        }
    }

    render(){
        console.log('Goods:',this)
        let {goods} = this.state;
        return (
            goods.info
            ?
            <div className="goods">
                <div className="goods-info">
                    <img src={goods.imgurl} alt={goods.info.goods_name}/>
                    <h1>{goods.info.goods_name}</h1>
                    <p className="price">
                        <del>{goods.info.goods_price}</del>
                        <span>{goods.info.goods_promotion_price}</span>
                    </p>
                    <Button type="warning" onClick={this.add2cart}>添加到购物车</Button>
                </div>
            </div>
            :
            null
        )
    }
}

// Goods = connect(state=>({
//     goodslist:state.goodslist
// }),(dispatch)=>{
//     return {
//         add:goods=>{
//             dispatch(add2cart(goods))
//         },
//         change:(id,qty)=>{console.log('qty:',qty)
//             // changeQty()用于生成Action
//             dispatch(changeQty(id,qty))
//         }
//     }
// })(Goods);

Goods = connect(
    state=>({
        goodslist:state.goodslist
    }),

    // 把actionCreators中所有export default出来的方法绑定给组件的props
    // 并自动调用dispatch
    dispatch=>bindActionCreators(cartActionCreators,dispatch)
)(Goods);
export default Goods;

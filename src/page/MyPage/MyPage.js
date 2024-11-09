import React from "react";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import "./style/orderStatus.style.css";
import { getOrder, setSelectedOrder } from "../../features/order/orderSlice";
import { ColorRing } from "react-loader-spinner";
import OrderDetailModal from "./component/OrderDetailModal";

const MyPage = () => {
  const dispatch = useDispatch();
  const { loading, orderList, selectedOrder } = useSelector(
    (state) => state.order
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  const handleCardClick = (order) => {
    dispatch(setSelectedOrder(order));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      </div>
    );

  if (orderList?.length === 0) {
    return (
      <Container className="no-order-box">
        <div>진행중인 주문이 없습니다.</div>
      </Container>
    );
  }
  return (
    <Container className="status-card-container">
      {orderList.map((item) => (
        <OrderStatusCard
          orderItem={item}
          className="status-card-container"
          key={item._id}
          onClick={() => handleCardClick(item)}
        />
      ))}
      {open && selectedOrder && Object.keys(selectedOrder).length > 0 && (
        <OrderDetailModal
          open={open}
          handleClose={handleClose}
          data={selectedOrder}
          header={[
            "번호",
            "주문번호",
            "주문날짜",
            "이메일",
            "상품명",
            "주소",
            "총 금액",
            "상태",
          ]}
        />
      )}
    </Container>
  );
};

export default MyPage;

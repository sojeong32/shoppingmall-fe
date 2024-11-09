import React from "react";
import { Modal, Button, Badge, Row, Col } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderDetailModal = ({ data, open, handleClose }) => {
  if (!data) return <></>;

  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>주문 상세 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col>
            <strong>주문 번호:</strong>
          </Col>
          <Col>{data.orderNum}</Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <strong>주문 날짜:</strong>
          </Col>
          <Col>{data.createdAt.slice(0, 10)}</Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <strong>배송지:</strong>
          </Col>
          <Col>{`(${data.shipTo.zip}) ${data.shipTo.address}, ${data.shipTo.city}`}</Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <strong>상품 정보:</strong>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <ul>
              {data.items.map((item, index) => (
                <li key={index}>
                  {item.productId.name} - {item.size} 사이즈{" "}
                  {currencyFormat(item.price)}원 {item.qty} 개
                </li>
              ))}
            </ul>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <strong>총 금액:</strong>
          </Col>
          <Col>{currencyFormat(data.totalPrice)} 원</Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <strong>주문 상태:</strong>
          </Col>
          <Col>
            <Badge bg={badgeBg[data.status]}>{data.status}</Badge>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailModal;

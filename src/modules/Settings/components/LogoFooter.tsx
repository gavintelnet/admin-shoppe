import { useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import {
  startLoading,
  stopLoading,
} from "../../../redux/reducers/loadingReducer";
import { createLogoFooter } from "../apis";
import { Button, Image, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

type Props = {
  detailLogoFooter: any;
};

const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};
const LogoFooter = (props: Props) => {
  const { detailLogoFooter } = props;
  const dispatch = useDispatch();
  const [logoFooter, setLogoFooter] = useState<string | null>(null);
  const [showConfirmLogoFooter, setShowConfirmLogoFooter] =
    useState<boolean>(false);

  const handleBeforeUploadLogoHeader = async (file: File) => {
    const base64 = await getBase64(file);
    setLogoFooter(base64);
    setShowConfirmLogoFooter(true);
    return false; // Prevent upload
  };
  const handleChangeLogoHeader = async (info: any) => {
    if (info.file.status === "removed") {
      setLogoFooter(null);
      setShowConfirmLogoFooter(false);
    }
  };
  const handleUpload = async () => {
    if (!logoFooter) {
      dispatch(
        showNotification({
          message: "Upload hình ảnh thất bại",
          type: "error",
        })
      );
      return;
    }

    dispatch(startLoading());
    const payload = { image: logoFooter };
    try {
      const rp = await createLogoFooter("665701da76b8c058a19a4780", payload);

      if (rp.status) {
        dispatch(
          showNotification({
            message: "Cập nhật hình ảnh thành công",
            type: "success",
          })
        );
        setShowConfirmLogoFooter(false);
      } else {
        dispatch(
          showNotification({
            message: "Cập nhật hình ảnh thất bại",
            type: "error",
          })
        );
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: "Cập nhật hình ảnh thất bại",
          type: "error",
        })
      );
    } finally {
      dispatch(stopLoading());
    }
  };
  return (
    <>
      <div>
        <h3>Banner đăng ký/ đăng nhập</h3>
        {logoFooter ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Image width={200} src={logoFooter} />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Image width={200} src={detailLogoFooter} />
          </div>
        )}
        {showConfirmLogoFooter && (
          <Button onClick={handleUpload}>Xác nhận</Button>
        )}
      </div>
      <Upload
        name="avatar"
        listType="picture"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={handleBeforeUploadLogoHeader}
        onChange={handleChangeLogoHeader}
        maxCount={1} // Allow only one file to be uploaded
      >
        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
      </Upload>
    </>
  );
};
export default LogoFooter;

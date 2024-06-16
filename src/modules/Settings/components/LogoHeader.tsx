import { useState } from "react";
import { Button, Image, Upload } from "antd";
import { useDispatch } from "react-redux";
import { showNotification } from "../../../redux/reducers/notificationReducer";
import {
  startLoading,
  stopLoading,
} from "../../../redux/reducers/loadingReducer";
import { createLogoHeader } from "../apis";
import { UploadOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";

type Props = {
  detailLogoHeader: any;
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
const LogoHeader = (props: Props) => {
  const { detailLogoHeader } = props;
  const dispatch = useDispatch();
  const [logoHeader, setLogoHeader] = useState<string | null>(null);
  const [showConfirmLogoHeader, setShowConfirmLogoHeader] =
    useState<boolean>(false);

  const handleBeforeUploadLogoHeader = async (file: File) => {
    const base64 = await getBase64(file);
    setLogoHeader(base64);
    setShowConfirmLogoHeader(true);
    return false; // Prevent upload
  };
  const handleChangeLogoHeader = async (info: any) => {
    if (info.file.status === "removed") {
      setLogoHeader(null);
      setShowConfirmLogoHeader(false);
    }
  };
  const handleUpload = async () => {
    if (!logoHeader) {
      dispatch(
        showNotification({
          message: "Không tìm thấy ảnh",
          type: "error",
        })
      );
      return;
    }

    dispatch(startLoading());
    const payload = { image: logoHeader };
    try {
      const rp = await createLogoHeader("6656784a2de1279e93bcc91a", payload);

      if (rp.status) {
        dispatch(
          showNotification({
            message: "Cập nhật logo thành công",
            type: "success",
          })
        );
        setShowConfirmLogoHeader(false);
      } else {
        dispatch(
          showNotification({
            message: "Có lỗi xảy ra",
            type: "error",
          })
        );
      }
    } catch (error) {
      dispatch(
        showNotification({
          message: error,
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
        <h3>Logo</h3>
        {logoHeader ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Image width={200} src={logoHeader} />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Image width={200} src={detailLogoHeader} />
          </div>
        )}
        {showConfirmLogoHeader && (
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
export default LogoHeader;

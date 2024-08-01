import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import icon from "@public/images/icon.png";
import SingleSelect from "../../components/SingleSelect";
import MultiSelect from "../../components/MultiSelect";
// import { apiFetch } from "@/http/fetch";
// import { loginUrl } from "@/http/api";

const Note = () => {
  const navigate = useNavigate();

  // 登录
  // const onLogin = () => {
  //   navigate("/home");
  // };

  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

  return (
    <div className={"w-full"}>
      <div></div>
      <SingleSelect options={options} maxHeight="32"></SingleSelect>
      <MultiSelect options={options} maxHeight="32"></MultiSelect>
    </div>
  );
};

export default Note;

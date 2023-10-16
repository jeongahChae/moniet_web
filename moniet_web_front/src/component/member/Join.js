import { useState, useRef, useEffect } from "react";
import Input from "./InputFrm";
import "./join.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberPwRe, setMemberPwRe] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [checkIdMsg, setCheckIdMsg] = useState("");
  const [checkPwMsg, setCheckPwMsg] = useState("");
  const [checkNameMsg, setCheckNameMsg] = useState("");
  const [checkPhoneMsg, setCheckPhoneMsg] = useState("");
  const [checkEmailMsg, setCheckEmailMsg] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [memberImg, setMemberImg] = useState(null);
  const navigate = useNavigate();
  const Emails = [
    "@naver.com",
    "@gmail.com",
    "@daum.net",
    "@hanmail.net",
    "@nate.com",
    "@kakao.com",
  ];
  const [emailList, setEmailList] = useState(Emails);
  const [selected, setSelected] = useState(-1);
  const [isDrobBox, setIsDropbox] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsDropbox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [inputRef]);
  const onChangeEmail = (e) => {
    setMemberEmail(e.target.value);

    if (e.target.value.includes("@")) {
      setIsDropbox(true);
      setEmailList(
        Emails.filter((el) => el.includes(e.target.value.split("@")[1]),
        ),
      );
    } else {
      setIsDropbox(false);
      setSelected(-1);
    }
  };
  const handleDropDownClick = (first, second) => {
    setMemberEmail(`${first.split("@")[0]}${second}`);
    setIsDropbox(false);
    setSelected(-1);
  };
  const handleKeyUp = (e) => {
    if (isDrobBox) {
      if (e.key === "ArrowDown" && emailList.length - 1 > selected) {
        setSelected(selected + 1);
      }
      if (e.key === "ArrowUp" && selected >= 0) {
        setSelected(selected - 1);
      }
      if (e.key === "Enter" && selected >= 0) {
        handleDropDownClick(memberEmail, emailList[selected]);
      }
    }
  };

  //이미지 업로드 input onChange
  const thumbnailChange = (e) => {
    const files = e.currentTarget.files;
    if (files.length !== 0 && files[0] != 0) {
      setThumbnail(files[0]);

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setMemberImg(reader.result);
      };
    } else {
      setThumbnail({});
      setMemberImg(null);
    }
  };

  const idCheck = () => {
    const idReg = /^[a-zA-Z0-9]{4,8}$/;
    if (!idReg.test(memberId)) {
      setCheckIdMsg("아이디는 영어 대/소문자/숫자로 4~8글자를 입력해주세요.");
    } else {
      axios
        .get("/member/checkId/", { params: { memberId: memberId } })
        .then((res) => {
          console.log(res.data);
          if (res.data == 0) {
            setCheckIdMsg("");
          } else {
            setCheckIdMsg("이미 사용중인 아이디 입니다.");
          }
        })
        .catch((res) => {
          console.log(res);
        });
    }
  };
  const pwCheck = () => {
    if (memberPw !== memberPwRe) {
      setCheckPwMsg("비밀번호가 일치하지 않습니다.");
    } else {
      setCheckPwMsg("");
    }
  };
  const nameCheck = () => {
    const nameReg = /^[가-힣]{2,4}$/;
    if (!nameReg.test(memberName)) {
      setCheckNameMsg("이름은 한글로 2~4글자를 입력해주세요.");
    } else {
      setCheckNameMsg("");
    }
  };
  const phoneCheck = () => {
    const phoneReg = /^[0-9]{3}-[0-9]{3,4}-[0-9]{4}$/;
    if (!phoneReg.test(memberPhone)) {
      setCheckPhoneMsg("'-'을 포함하여 올바른 형식으로 입력해주세요.");
    } else {
      setCheckPhoneMsg("");
    }
  };
  const emailCheck = () => {
    const emailReg = /^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\.[A-za-z0-9\\-]+/;
    if (!emailReg.test(memberEmail)) {
      setCheckEmailMsg("'@'를 포함하여 올바른 형식으로 입력해주세요.");
    } else {
      setCheckEmailMsg("");
    }
  };
  //회원가입
  const join = () => {
    if (
      checkIdMsg === "" &&
      checkPwMsg === "" &&
      checkNameMsg === "" &&
      checkPhoneMsg === "" &&
      checkEmailMsg == ""
    ) {
      const form = new FormData();
      form.append("thumbnail", thumbnail);
      form.append("memberId", memberId);
      form.append("memberPw", memberPw);
      form.append("memberName", memberName);
      form.append("memberPhone", memberPhone);
      form.append("memberEmail", memberEmail);
      axios
        .post("/member/join", form, {
          headers: {
            contentType: "multipart/form-data",
            processdData: false, //문자열 말고 file type도 있는걸 알려줌
          },
        })
        .then((res) => {
          if (res.data === 1) {
            Swal.fire(
              "회원가입이 완료되었습니다!",
              "로그인 페이지로 이동합니다.",
              "success"
            );
            navigate("/login");
          } else {
            Swal.fire("회원가입 실패");
          }
        })
        .catch((res) => {
          console.log(res.data);
        });
    } else {
      alert("필수 정보 항목을 입력해주세요.");
    }
  };
  return (
    <div className="join-wrap">
      <div className="join-title">MEMBERSHIP</div>
      <div className="join-img-wrap">
        {memberImg === null ? (
          <img src="/image/piggy.jpg" />
        ) : (
          <img src={memberImg} />
        )}
      </div>
      <div className="join-profile-wrap">
        <label htmlFor="profileImg" className="signup-profileImg-label">
          프로필 이미지 업로드
        </label>
        <input
          className="sign-up-profile-img-input"
          type="file"
          accept="image/jpg,impge/png,image/jpeg"
          id="profileImg"
          onChange={thumbnailChange}
        />
      </div>
      <JoinInputWrap
        data={memberId}
        setData={setMemberId}
        type="type"
        content="memberId"
        label="아이디"
        checkMsg={checkIdMsg}
        blurEvent={idCheck}
      />
      <JoinInputWrap
        data={memberPw}
        setData={setMemberPw}
        type="password"
        content="memberPw"
        label="비밀번호"
      />
      <JoinInputWrap
        data={memberPwRe}
        setData={setMemberPwRe}
        type="password"
        content="memberPwRe"
        label="비밀번호 확인"
        checkMsg={checkPwMsg}
        blurEvent={pwCheck}
      />
      <JoinInputWrap
        data={memberName}
        setData={setMemberName}
        type="type"
        content="memberName"
        label="이름"
        checkMsg={checkNameMsg}
        blurEvent={nameCheck}
      />
      <JoinInputWrap
        data={memberPhone}
        setData={setMemberPhone}
        type="type"
        content="memberPhone"
        label="전화번호"
        checkMsg={checkPhoneMsg}
        blurEvent={phoneCheck}
      />
      <div ref={inputRef} className="join-mail-wrap">
        <label htmlFor="membeMail">이메일</label>
        <input
          type="text"
          value={memberEmail}
          name={memberEmail}
          id="memberMail"
          onChange={(e) => {
            onChangeEmail(e);
          }}
          onKeyUp={handleKeyUp}
          onBlur={emailCheck}
        />
        <div className="check-msg">{checkEmailMsg}</div>
        {isDrobBox && (
          <div className="email-list">
            {emailList.map((item, idx) => (
              <li
                key={idx}
                onMouseOver={() => setSelected(idx)}
                onClick={() => handleDropDownClick(memberEmail, item)}
                selected={selected === idx}
              >
                {memberEmail.split("@")[0]}
                {item}
              </li>
            ))}
          </div>
        )}
        </div>
        <div className="join-button">
          <button type="button" onClick={join}>
            회원가입
          </button>
        </div>
    </div>
  );
};

const JoinInputWrap = (props) => {
  const data = props.data;
  const setData = props.setData;
  const type = props.type;
  const content = props.content;
  const label = props.label;
  const checkMsg = props.checkMsg;
  const blurEvent = props.blurEvent;

  return (
    <div className="join-input-wrap">
      <div>
        <label htmlFor={content}>{label}</label>
      </div>
      <div>
        <Input
          type={type}
          data={data}
          setData={setData}
          content={content}
          blurEvent={blurEvent}
        />
      </div>
      <div className="check-msg">{checkMsg}</div>
    </div>
  );
};
export default Join;

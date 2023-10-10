package kr.or.iei.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.JwtUtil;
import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.vo.Member;

@Service
public class MemberService {
	@Autowired
	private MemberDao memberDao;
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	@Autowired
	private JwtUtil jwtUtil;
	@Value("${jwt.secret}")
	private String secretKey;
	private long expiredMs;

	public MemberService() {
		super();
		expiredMs = 1000*60*60l;
	}

	public Member selectOneMember(String memberId) {
		return memberDao.selectOneMember(memberId);
	}
	
	@Transactional
	public int insertMember(Member member) {
		return memberDao.insertMember(member) ;
	}

	public String login(Member member) {
		Member m = memberDao.selectOneMember(member.getMemberId());
		if(m != null && bCryptPasswordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
			return jwtUtil.createToken(member.getMemberId(), secretKey, expiredMs);
		}else {
			return "실패";
		}
		
	}

	@Transactional
	public int deleteMember(String memberId) {
		return memberDao.deleteMember(memberId);
	}

	@Transactional
	public int updateMemberInfo(Member member) {
		return memberDao.updateMemberInfo(member);
	}

	public int pwCheck(Member member) {
		Member m = memberDao.selectOneMember(member.getMemberId());
		if(m!=null && bCryptPasswordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
			return 1;
	}
		return 0;
	}

	@Transactional
	public int updatePw(Member member) {
		return memberDao.updatePw(member);
	}

	

	
}

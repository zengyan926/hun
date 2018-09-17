package web;


import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class CheckServlet
 */
@WebServlet("/CheckServlet")
public class CheckServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CheckServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		String  nickName =(String)request.getParameter("nickName");
		System.out.println(nickName);
		String adress="index.html";
		if(check(nickName)){
			request.setAttribute("isTrue", check(nickName));
			adress="index.jsp";
		}
		request.getRequestDispatcher(adress).forward(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	public boolean check(String nickName){
		
		if(WebSocketTest.getOnlineCount()>0){
			ConcurrentHashMap<String, WebSocketTest2> webSocketSet=WebSocketTest2.webSocketSet;
			return webSocketSet.containsKey(nickName);
		}
		return false;
	}
}

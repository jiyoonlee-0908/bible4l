function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>BibleAudio 4L</h1>
      <p>앱이 성공적으로 로드되었습니다!</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => alert('성공!')} style={{ 
          padding: '10px 20px', 
          fontSize: '16px',
          backgroundColor: '#8B4513',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          테스트 버튼
        </button>
      </div>
    </div>
  );
}

export default App;
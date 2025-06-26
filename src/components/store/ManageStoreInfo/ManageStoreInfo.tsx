export default function ManageStoreInfo() {
  return (
    <div>
      <p>店舗情報管理</p>
      <p>ここには店舗情報を管理するフォームが表示されます</p>
      <form>
        <div>
          <label>店舗名</label>
          <input type="text" />
        </div>
        <div>
          <label>店舗情報</label>
          <textarea></textarea>
        </div>
        <div>
          <button>更新</button>
        </div>
      </form>
    </div>
  );
}
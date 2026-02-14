

export const BookContentNotFound = () => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1400,
        height: '100%',
        maxHeight: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background-primary)',
        borderRadius: '4px',
        color: 'var(--text-color-primary)',
        padding: '24px',        
      }}
    >
      <div>
        <p>Страницы не найдены</p>
        <p style={{ fontSize: 'var(--font-size-base)', marginTop: '10px' }}>
          Разместите в папке <code>public/image/</code> файлы:
          <br />
          <code>page_0.jpg</code>, <code>page_1.jpg</code>,{' '}
          <code>page_2.jpg</code> и т.д.
        </p>
      </div>
    </div>
  )
}

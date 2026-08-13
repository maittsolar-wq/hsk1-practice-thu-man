export default function Result({
  correct,
  total,

  completedCount,
  lessonTotal,
  lessonCompleted,

  onRetry,
  onContinue,
  onChangeMode,
}) {

  const percent =
    total > 0
      ? Math.round(
          (correct / total) * 100
        )
      : 0


  let message =
    'Cần cố gắng thêm!'


  if (percent === 100) {

    message = 'Rất tốt!'

  } else if (percent >= 80) {

    message = 'Làm rất tốt!'

  } else if (percent >= 60) {

    message = 'Khá tốt!'
  }


  return (

    <section className="result-card">


      {/* =====================================
          HOÀN THÀNH TOÀN BỘ DẠNG BÀI
      ====================================== */}

      {lessonCompleted ? (

        <>

          <div className="result-complete-icon">
            ✓
          </div>


          <p className="result-eyebrow">
            HOÀN THÀNH BÀI HỌC
          </p>


          <h2 className="result-score">
            {correct}/{total}
          </h2>


          <p className="result-percent">
            {percent}% chính xác
          </p>


          <h3 className="result-message">
            🎉 Bạn đã học hết dạng bài này!
          </h3>


          <div className="lesson-progress-summary">

            Đã hoàn thành{' '}

            <strong>
              {lessonTotal}/{lessonTotal}
            </strong>

            {' '}câu

          </div>


          <div
            className="
              result-actions
              result-actions--completed
            "
          >

            <button
              type="button"
              className="
                result-button
                result-button-outline
              "
              onClick={onRetry}
            >
              Làm lại
            </button>


            <button
              type="button"
              className="
                result-button
                result-button-primary
              "
              onClick={onChangeMode}
            >
              Đổi dạng bài
            </button>

          </div>

        </>

      ) : (

        /* =====================================
            HOÀN THÀNH 1 BỘ CÂU
        ====================================== */

        <>

          <p className="result-eyebrow">
            HOÀN THÀNH
          </p>


          <h2 className="result-score">
            {correct}/{total}
          </h2>


          <p className="result-percent">
            {percent}% chính xác
          </p>


          <h3 className="result-message">
            {message}
          </h3>


          <div className="lesson-progress-summary">

            Đã học{' '}

            <strong>
              {completedCount}/{lessonTotal}
            </strong>

            {' '}câu

          </div>


          <div
            className="
              result-actions
              result-actions--three
            "
          >

            {/* LÀM LẠI */}

            <button
              type="button"
              className="
                result-button
                result-button-outline
              "
              onClick={onRetry}
            >
              Làm lại
            </button>


            {/* LÀM TIẾP */}

            <button
              type="button"
              className="
                result-button
                result-button-primary
              "
              onClick={onContinue}
            >
              Làm tiếp
            </button>


            {/* ĐỔI DẠNG */}

            <button
              type="button"
              className="
                result-button
                result-button-secondary
              "
              onClick={onChangeMode}
            >
              Đổi dạng bài
            </button>

          </div>

        </>

      )}

    </section>
  )
}
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type ServerResponseType } from '@/shared'
import { AxiosError } from 'axios'
import type { IPageImage } from '@/entities'

// Функция для проверки существования файла
const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

// Функция для поиска всех страниц по строгому паттерну
const findPages = async () => {
  const foundPages: IPageImage[] = []
  // Максимальное количество страниц для проверки
  const maxPages = 100
  for (let pageNum = 0; pageNum < maxPages; pageNum++) {
    // Строгий паттерн: /image/page_0.jpg, /image/page_1.jpg и т.д.
    const imagePath = `/image/page_${pageNum}.jpg`
    const exists = await checkImageExists(imagePath)
    if (exists) {
      foundPages.push({
        page: pageNum + 1, // Показываем пользователю страницы с 1
        image: imagePath,
      })
    } else {
      // Если не нашли страницу, прерываем цикл
      // (предполагаем, что страницы идут по порядку без пропусков)
      break
    }
  }
  return { statusCode: 200, message: 'success', data: foundPages }
}

export const getAllBookPagesThunk = createAsyncThunk<
ServerResponseType<IPageImage[]>,
  void,
  { rejectValue: ServerResponseType }
>('testApi/BookPages', async (_, { rejectWithValue }) => {
  try {
    // throw new Error('ошибка при загрузке страниц книги')
    // const { data } =
    //   await axiosInstance.get<ServerResponseType<IPageImage[]>>('/getBookPages')
    // console.log(data)
    const response = await findPages()
    return response
  } catch (error) {
    const err = error as AxiosError<ServerResponseType>
    return rejectWithValue(err.response!.data)
  }
})

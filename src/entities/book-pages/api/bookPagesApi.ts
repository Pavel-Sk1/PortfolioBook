import { axiosInstance, type ServerResponseType } from '@/shared'

import type {
  DtoBookContentLinks,  
  IPageImage,
} from '../model/book.types'

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
const findPages = async (): Promise<IPageImage[]> => {
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
  return foundPages
}

/**
 * Загружает все страницы книги
 * @returns Promise с массивом страниц книги
 */
export const getAllBookPages = async (): Promise<IPageImage[]> => {
  try {
    // Можно раскомментировать для использования реального API
    // const { data } =
    //   await axiosInstance.get<ServerResponseType<IPageImage[]>>('/getBookPages')
    // return data.data

    // Текущая реализация: поиск страниц по паттерну
    const bookPages = await findPages()
    return bookPages
  } catch (error) {
    throw new Error(
      (error as Error)?.message || 'Ошибка при получении страниц книги',
    )
  }
}

export const getAllBookContentLinks = async (): Promise<
  ServerResponseType<DtoBookContentLinks[]>
> => {
  try {
    const response = await axiosInstance.get<
      ServerResponseType<DtoBookContentLinks[]>
    >('./links/book_content_links.json')
console.log('getAllBookContentLinks', response.data);

    if (response.data.statusCode !== 200) {
      throw new Error(response.data.error ?? response.data.message)
    }
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error((error as Error)?.message || 'Ошибка при получении ссылок')
  }
}

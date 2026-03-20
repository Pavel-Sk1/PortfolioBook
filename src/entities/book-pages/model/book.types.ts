export interface IPageImage {
  page: number
  image: string
}

// export interface DtoBookContentLinks {
//     project_title: string
//     page_number: number
// }

// export interface IBookContentLinks {
//   projectTitle: string
//   pageNumber: number
// }

export interface IBookContentLinks {
  pageNumber: number
  pageName: string
  position: { left: number; top: number }
  projectTextColor: string
  linksTextColor: string
  pageLinks: {
    projectTitle: string
    pageNumber: number
  }[]
}

export interface DtoBookContentLinks {
  page_number: number
  page_name: string
  position: { left: number; top: number }
  project_text_color: string
  links_text_color: string
  page_links: Array<{
    project_title: string
    page_number: number
  }>
}

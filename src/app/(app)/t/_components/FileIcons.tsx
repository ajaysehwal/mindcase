import { allowedFileTypes } from "./SidebarRight";
export const FileIcons = ({ fileType }: { fileType: string }) => {
  const isPdf = allowedFileTypes[".pdf"].includes(fileType);
  const isDocx = allowedFileTypes[".docx"].includes(fileType);
  const isTxt = allowedFileTypes[".txt"].includes(fileType);
  if (isPdf) {
    return (
      <svg
        id="Layer_1"
        enable-background="new 0 0 512 512"
        className="h-5 w-5"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <g clip-rule="evenodd" fill-rule="evenodd">
            <path
              d="m168.584 0h173.398l153.062 153.091v293.98c0 35.698-29.202 64.929-64.929 64.929h-261.53c-35.698 0-64.9-29.231-64.9-64.929v-382.142c0-35.698 29.202-64.929 64.899-64.929z"
              fill="#e5252a"
            />
            <path
              d="m341.982 0 153.062 153.091h-136.559c-9.1 0-16.503-7.432-16.503-16.532z"
              fill="#b71d21"
            />
            <path
              d="m31.206 218.02h352.618c7.842 0 14.25 6.408 14.25 14.25v129.36c0 7.842-6.408 14.25-14.25 14.25h-352.618c-7.842 0-14.25-6.408-14.25-14.25v-129.36c0-7.842 6.409-14.25 14.25-14.25z"
              fill="#b71d21"
            />
          </g>
          <path
            d="m117.759 244.399h-26.598c-4.565 0-8.266 3.701-8.266 8.266v43.598 10.738 34.206c0 4.565 3.701 8.266 8.266 8.266s8.266-3.701 8.266-8.266v-25.94h18.331c19.224 0 34.864-15.64 34.864-34.863v-1.141c.001-19.224-15.639-34.864-34.863-34.864zm18.332 36.004c0 10.108-8.224 18.331-18.332 18.331h-18.332v-2.472-35.332h18.331c10.108 0 18.332 8.224 18.332 18.331v1.142zm70.62-36.004h-26.597c-4.565 0-8.266 3.701-8.266 8.266v88.542c0 4.565 3.701 8.266 8.266 8.266h26.597c19.224 0 34.864-15.64 34.864-34.863v-35.347c0-19.224-15.64-34.864-34.864-34.864zm18.332 70.21c0 10.108-8.224 18.331-18.332 18.331h-18.331v-72.01h18.331c10.108 0 18.332 8.224 18.332 18.331zm53.897-53.678v22.882h38.317c4.565 0 8.266 3.701 8.266 8.266s-3.701 8.266-8.266 8.266h-38.317v40.862c0 4.565-3.701 8.266-8.266 8.266s-8.266-3.701-8.266-8.266v-88.542c0-4.565 3.701-8.266 8.266-8.266h53.195c4.565 0 8.266 3.701 8.266 8.266s-3.701 8.266-8.266 8.266z"
            fill="#fff"
          />
        </g>
      </svg>
    );
  }
  if (isTxt) {
    return (
      <svg
        id="Capa_1"
        enable-background="new 0 0 791.454 791.454"
        className="h-5 w-5"
        viewBox="0 0 791.454 791.454"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <g id="Vrstva_x0020_1_25_">
            <path
              clip-rule="evenodd"
              d="m202.808 0h264.609l224.265 233.758v454.661c0 56.956-46.079 103.035-102.838 103.035h-386.036c-56.956 0-103.035-46.079-103.035-103.035v-585.384c-.001-56.956 46.078-103.035 103.035-103.035z"
              fill="#251d36"
              fill-rule="evenodd"
            />
            <g fill="#fff">
              <path
                clip-rule="evenodd"
                d="m467.219 0v231.978h224.463z"
                fill-rule="evenodd"
                opacity=".302"
              />
              <path d="m249.282 577.868v-112.528h-41.135v-31.247h118.857v31.247h-40.937v112.528zm211.411 0h-38.564l-26.303-44.102-26.303 44.102h-38.762l45.684-76.733-39.948-67.042h38.564l20.765 34.807 20.568-34.807h38.762l-39.948 67.24zm44.695 0v-112.528h-40.938v-31.247h118.857v31.247h-41.135v112.528z" />
            </g>
          </g>
        </g>
      </svg>
    );
  }
  if (isDocx) {
    return (
      <svg
        id="Layer_1"
        enable-background="new 0 0 512 512"
        viewBox="0 0 512 512"
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <g clip-rule="evenodd" fill-rule="evenodd">
            <path
              d="m168.579 0h173.378l153.1 153.07v293.997c0 35.729-29.233 64.933-64.933 64.933h-261.545c-35.7 0-64.933-29.204-64.933-64.933v-382.134c.001-35.73 29.234-64.933 64.933-64.933z"
              fill="#008bf5"
            />
            <path
              d="m341.958 0 153.1 153.07h-136.567c-9.1 0-16.533-7.403-16.533-16.504z"
              fill="#006fc4"
            />
            <path
              d="m31.193 218.003h352.638c7.813 0 14.251 6.408 14.251 14.251v129.368c0 7.842-6.438 14.28-14.251 14.28h-352.638c-7.842 0-14.251-6.438-14.251-14.28v-129.368c.001-7.843 6.409-14.251 14.251-14.251z"
              fill="#006fc4"
            />
          </g>
          <path
            d="m169.779 244.413c-19.225 0-34.865 15.641-34.865 34.865v35.348c0 19.225 15.641 34.865 34.865 34.865 19.226 0 34.866-15.641 34.866-34.865v-35.348c0-19.225-15.64-34.865-34.866-34.865zm18.333 70.213c0 10.108-8.224 18.332-18.333 18.332-10.108 0-18.332-8.224-18.332-18.332v-35.348c0-10.108 8.224-18.332 18.332-18.332 10.109 0 18.333 8.224 18.333 18.332zm44.215-35.348v35.348c0 10.108 8.224 18.332 18.332 18.332 10.109 0 18.333-8.224 18.333-18.332 0-4.566 3.701-8.267 8.267-8.267s8.266 3.701 8.266 8.267c0 19.225-15.641 34.865-34.866 34.865s-34.865-15.641-34.865-34.865v-35.348c0-19.225 15.641-34.865 34.865-34.865 19.226 0 34.866 15.641 34.866 34.865 0 4.566-3.701 8.267-8.266 8.267-4.566 0-8.267-3.701-8.267-8.267 0-10.108-8.224-18.332-18.333-18.332-10.108 0-18.332 8.224-18.332 18.332zm-144.833-34.865h-26.599c-4.566 0-8.266 3.701-8.266 8.266v88.546c0 4.566 3.701 8.266 8.266 8.266h26.599c19.225 0 34.865-15.641 34.865-34.865v-35.348c.001-19.225-15.64-34.865-34.865-34.865zm18.333 70.213c0 10.108-8.224 18.332-18.332 18.332h-18.333v-72.013h18.332c10.108 0 18.332 8.224 18.332 18.332v35.349zm255.361 22.342c2.351 3.913 1.085 8.992-2.829 11.343-1.333.8-2.801 1.181-4.249 1.181-2.807 0-5.544-1.43-7.094-4.01l-19.513-32.479-19.513 32.479c-1.55 2.581-4.288 4.01-7.094 4.01-1.45 0-2.916-.381-4.249-1.181-3.913-2.351-5.18-7.43-2.829-11.343l24.042-40.016-24.042-40.016c-2.351-3.913-1.085-8.992 2.829-11.343 3.915-2.351 8.992-1.084 11.343 2.829l19.513 32.479 19.513-32.479c2.351-3.913 7.429-5.18 11.343-2.829 3.913 2.351 5.18 7.43 2.829 11.343l-24.042 40.016z"
            fill="#fff"
          />
        </g>
      </svg>
    );
  }
 
  
};

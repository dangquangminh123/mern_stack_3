import React, {memo} from "react";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const Breadcrumd = ({title, category}) => {
    const routes = [
      {path: '/:category', breadcrumb: category},
      {path: "/", breadcrumb: 'Home'},
      {path: '/:category/:pid/:title', breadcrumb: title},
    ];

    const breadcrumb = useBreadcrumbs(routes);
    // console.log(breadcrumb);
  return (
    <div className='flex items-center text-sm gap-1'>
        {/* lúc này trong biến breadcrumb object thứ 3 là 1 object không có chứa properties route nên
         mình phải filter cho nó là false để object đó không được hiển thị ra trên màn hình*/}
     {breadcrumb?.filter(el => !el.match.route === false).map(({ match, breadcrumb }, index, self) => (
        <Link className='flex items-center hover:text-main gap-1' key={match.pathname} to={match.pathname}>
            <span className="capitalize">{breadcrumb}</span>
            {/* index đứng vị trí nào cũng được nhưng loại trừ vị trí cuối cùng ra thì icons mới được hiển thị còn lại ko đc hiển thị */}
            {index !== self.length - 1 && <IoIosArrowForward />}
        </Link>
      ))}
    </div>
  );
};

export default memo(Breadcrumd);

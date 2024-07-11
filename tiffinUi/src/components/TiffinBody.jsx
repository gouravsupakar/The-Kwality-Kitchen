import React, {useState, useEffect} from 'react'
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles.css'
import picture from '../assets/home-bg.jpg'

const TiffinBody = () => {

  const myStyle ={
    backgroundImage: `url(${picture})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'repeat',
  }

  const [lunchItems, setLunchItems] = useState([]);
  const [dinnerItems, setDinnerItems] = useState([]);
  const cart = [];
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null); 
  const [currentMonthYear, setCurrentMonthYear] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  
  
  

  useEffect(() => {

    axios.get("http://localhost:3000/tiffinLunchItems")
    .then((response) => setLunchItems(response.data))
    .catch((error) => {
      console.log("error in lunchItems data", error)
    });

    axios.get("http://localhost:3000/tiffinDinnerItems")
    .then((response) => setDinnerItems(response.data))
    .catch((error) => {
      console.log("error in lunchItems data", error)
    })

  }, [])

  // const addToCart = (name, price, itemType) => {

  //   const userConfirmed = window.confirm("Customize thali?");
    
  //   const product = {
  //     name: name,
  //     price: price,
  //     quantity: 1,
  //     plan: selectedPlan === 'monthly' ? selectedMonths : selectedWeeks,
  //     itemType: itemType
  //   }

  //   cart.push(product)

  //   sendData(cart);

  //   if (userConfirmed) {
  //     console.log("Customize items");
  //   } else {
  //     console.log("Dont customize items")
  //   }

  //   console.log(cart);

  //   console.log(selectedPlan);
  // }


  // const sendData = (tiffinData) => {
  //   const jsonData = JSON.stringify({ tiffinData });

  //   fetch("http://localhost:3000/cart", {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: jsonData
  //   })
  //   .then(res => res.json())
  //   .then(data => console.log('Tiffin data sent successfully:', data))
  //   .catch(error => console.error('Error sending tiffin data:', error));
  // };

  const handleMonthChange = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthYear = `${month + 1}-${year}`;
    
    if (!selectedMonths.includes(monthYear)) {
      setSelectedMonths([...selectedMonths, monthYear]);
    }
  };


  const handleRemoveMonth = (monthYear) => {
    setSelectedMonths(selectedMonths.filter((month) => month !== monthYear));
    setSelectedWeeks(
      selectedWeeks.filter((week) => {
        const [month, year] = monthYear.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const datesToRemove = [];
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
          datesToRemove.push(new Date(date).toLocaleDateString('en-GB').split('/').join('/'));
        }
        return !datesToRemove.includes(week.split(' - ')[0]);
      })
    );
  };

  const handleWeekChange = (date) => {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const weekRange = `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`;

    if (!selectedWeeks.includes(weekRange)) {
      setSelectedWeeks([...selectedWeeks, weekRange]);
    }
  };

  
  const handleRemoveWeek = (weekRange) => {
    // Filter out the selected week
    setSelectedWeeks(selectedWeeks.filter(week => week !== weekRange));
  
    // Remove associated dates
    const [startDateString] = weekRange.split(' - ');
    const startDate = new Date(startDateString);
    const endDate = new Date(startDateString);
    endDate.setDate(endDate.getDate() + 6); // Calculate end date by adding 6 days to start date (assuming week is from Monday to Sunday)
    const datesToRemove = [];
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      datesToRemove.push(new Date(date).toLocaleDateString('en-GB').split('/').join('/'));
    }
    setSelectedMonths(selectedMonths.filter(month => {
      const [monthNum, year] = month.split('-').map(Number);
      const firstDayOfMonth = new Date(year, monthNum - 1, 1).toLocaleDateString('en-GB').split('/').join('/');
      return !datesToRemove.includes(firstDayOfMonth); // Check if any date within the week is not in the removed month
    }));
  };
  

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    if (plan === 'monthly') {
      setShowCalendar(!showCalendar);
      setShowWeekPicker(false);
    } else if (plan === 'weekly') {
      setShowCalendar(false);
      setShowWeekPicker(!showWeekPicker);
    }
  };


  const handleAddItems = (timePeriod) => {
    if (selectedPlan === 'monthly') {
      setCurrentMonthYear(timePeriod);
    } else if (selectedPlan === 'weekly') {
      setCurrentWeek(timePeriod);
    }
  };


  const generateDates = (timePeriod) => {
    if (!timePeriod) {
      return [];
    }
    if (selectedPlan === 'monthly') {
      const currentDate = new Date();
      const [month, year] = timePeriod.split('-').map(Number);
      let startDate;
      if (currentDate.getMonth() === month - 1 && currentDate.getFullYear() === year) {
        startDate = currentDate;
      } else {
        startDate = new Date(year, month - 1, 1);
      }
      const endDate = new Date(year, month, 0);
      const dates = [];
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date).toLocaleDateString('en-GB').split('/').join('/'));
      }
      return dates;
    } else if (selectedPlan === 'weekly') {
      const [startDateString, endDateString] = timePeriod.split(' - ').map((date) => new Date(date));
      const dates = [];
      for (let date = new Date(startDateString); date <= endDateString; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date).toLocaleDateString('en-GB').split('/').join('/'));
      }
      return dates;
    }
  };


  const handleAddSingleLunch = (date) => {
    // Logic to add a single lunch item for the given date
    console.log(`Add single lunch for ${date}`);
  };

  const handleAddSingleDinner = (date) => {
    // Logic to add a single dinner item for the given date
    console.log(`Add single dinner for ${date}`);
  };

  const handleSkipLunch = (date) => {
    console.log(`Skip lunch for ${date}`);
  };

  const handleSkipDinner = (date) => {
    console.log(`Skip dinner for ${date}`);
  };

  const handleSkipBoth = (date) => {
    console.log(`Skip both meals for ${date}`);
  };


  // perfect the code to add the objects in the array from the given function and render it given below


  const selectedLunchItems = [];
  const addLunchToList = (name, price, itemType) => {

    const product = {
      name: name,
      price: price,
      itemType: itemType,
      mealDates: selectedPlan === 'monthly' ? [currentMonthYear] : [currentWeek],
      plan: selectedPlan === 'monthly' ? "Monthly" : "Weekly",
      quantity: 1
    }

    selectedLunchItems.push(product);

    console.log(itemType);
    console.log(name);
    console.log(price);
    console.log(product);
    console.log(selectedLunchItems);
  }

  const selectedDinnerItems = []
  const addDinnerToList = (name, price, itemType) => {

    const product = {
      name: name,
      price: price,
      itemType: itemType,
      mealDates: selectedPlan === 'monthly' ? [currentMonthYear] : [currentWeek],
      plan: selectedPlan === 'monthly' ? "Monthly" : "Weekly",
      quantity: 1
    }

    selectedDinnerItems.push(product)

    console.log(itemType);
    console.log(name);
    console.log(price);
    console.log(product);

  }


  return (
    <>
    <div style={myStyle}>

    <div className='btnDiv flex gap-2 justify-center p-2 pb-5 pt-5'>


    <button   onClick={() => handleSelectPlan('monthly')}
    className='monthlyPlan btn bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 border border-white-700 rounded-lg'>Monthly Plan</button>


    <button onClick={() => handleSelectPlan('weekly')}
    className='weeklyPlan btn bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 border border-white-700 rounded-lg'>Weekly Plan</button>


    </div>


    {showCalendar && (
          <div className="calendarDiv flex justify-center mb-4">
            <DatePicker
              selected={null}
              onChange={handleMonthChange}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              inline
            />
          </div>
    )}

    {showWeekPicker && (
          <div className="weekPickerDiv flex justify-center mb-4">
            <DatePicker
              selected={null}
              onChange={handleWeekChange}
              dateFormat="wo yyyy"
              showWeekNumbers
              inline
            />
          </div>
    )}

    
    {selectedMonths.length > 0 && (
          <div className="selectedMonthsDiv text-center mb-4">
            <h3 className="mb-2">Selected Months:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedMonths.map((monthYear, index) => (
                <div key={index} className="selectedMonth bg-blue-500 text-white p-2 rounded-lg">
                  {monthYear} 
                  <button
                   onClick={() => handleAddItems(monthYear)}
                   className="addToList ml-2 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-1 border border-white-700 rounded-lg">
                    Add Items</button>
                  <button
                    onClick={() => handleRemoveMonth(monthYear)}
                    className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 border border-white-700 rounded-lg">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
    )}


    {selectedWeeks.length > 0 && (
          <div className="selectedWeeksDiv text-center mb-4">
            <h3 className="mb-2">Selected Weeks:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedWeeks.map((weekYear, index) => (
                <div key={index} className="selectedWeek bg-blue-500 text-white p-2 rounded-lg">
                  {weekYear} 
                  <button
                   onClick={() => handleAddItems(weekYear)}
                   className="addToList ml-2 bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-1 border border-white-700 rounded-lg">
                    Add Items
                    </button>

                  <button
                    onClick={() => handleRemoveWeek(weekYear)}
                    className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-700 rounded-lg">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
    )}


    {(currentMonthYear || currentWeek) && (
          <div className="dateDiv flex justify-center mb-4">
            <div className='dateTableDiv '>
              {selectedPlan === 'monthly' ? <h3>{currentMonthYear}</h3>: <h3>{currentWeek}</h3>}
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th className='px-1'>Lunch Items</th>
                    <th className='px-1'>Dinner Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {generateDates(selectedPlan === 'monthly' ? currentMonthYear : currentWeek).map((date, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{date}</td>

                    // render the lunch items here
                    <td className="border px-4 py-2 lunchItemsList">
                    
                    </td>

                    // render the tiffin items here
                    <td className="border px-4 py-2 dinnerItemsList">
                    
                    </td>
                    <td className="border px-4 py-2">
                    <button
                    onClick={() => handleSkipLunch(date)}
                    className="ml-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-1 border border-white-700 rounded-lg"
                  >
                    Skip Lunch
                  </button>
                  <button
                    onClick={() => handleSkipDinner(date)}
                    className="ml-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-1 border border-white-700 rounded-lg"
                  >
                    Skip Dinner
                  </button>
                  <button
                    onClick={() => handleSkipBoth(date)}
                    className="ml-1 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-1 border border-white-700 rounded-lg"
                  >
                    Skip Both
                  </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
    )}



    <div className='w-full text-center'><h1 className='itemsTitle p-2 size-25 mb-2 mt-2'>Lunch Items</h1></div>
   
    <div className='lunchItemsDiv flex flex-wrap  items-center p-2 mb-4 gap-4 ml-4 mr-4 text-center justify-center'>
    
      {lunchItems.map((items) => (
        <div key={items._id} className='cardDiv shadow-md p-2 sm:w-1/2 md:w-1/3 lg:w-1/4'>

          <div className='imageDiv'>
          <img className='itemImage shadow-xl' src={`data:image/jpg;base64,${items.image}`} alt="" />
          </div>
         
          <div className='contentDiv'>
          <h2 className='itemName pt-1 pb-1 text-red-500'>{items.Name}</h2>
          <p className='text-gray-500 size mt-1 mb-1'>{items.content}</p>
          
          </div>

          <h2 className='itemPrice mb-2'>Price: ₹{items.price}</h2> 

          <button onClick={() => (addLunchToList(items.Name, items.price, items.itemType))} className='btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-white-700 rounded-lg'>Add to list</button>
        </div>
      ))}
      
    </div>

    <div className='w-full text-center'><h1 className='itemsTitle p-2 size-25 mb-2 mt-2'>Dinner Items</h1></div>

    <div className='dinnerItemsDiv  flex flex-wrap items-center p-2 mb-4 gap-4 ml-4 mr-4 text-center justify-center'>
      
      {dinnerItems.map((items) => (
        <div key={items._id} className='cardDiv shadow-md p-2 sm:w-1/2 md:w-1/3 lg:w-1/4'>
          
            <div className='imageDiv'>
          <img className='itemImage shadow-xl' src={`data:image/jpg;base64,${items.image}`} alt="lunch item" />
            </div>

            <div className='contentDiv'>
            <h2 className='itemName pt-1 pb-1 text-red-500'>{items.Name}</h2>
            <p className='text-gray-500 mt-1 mb-1'>{items.content}</p>
            </div>
            <h2 className='itemPrice mb-2'>Price: ₹{items.price}</h2> 
      
          <button onClick={() => (addDinnerToList(items.Name, items.price, items.itemType))} className='btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-white-700 rounded-lg'>Add to list</button>
        </div>
      ))}
      
    </div>
    </div>
    </>
  )

    
}

export default TiffinBody
